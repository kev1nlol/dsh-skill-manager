import { randomUUID } from 'node:crypto'
import { promises as fsp } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/**
 * SKILL Manager.
 *
 * Groups are pure bookkeeping: they are stored beside the Harness home and never
 * change how a skill is discovered. The enable/disable switch is the part that
 * affects usage. A disabled skill is re-published through a scope-local skill
 * provider (rank 0, `modelInvocable: false`, `userInvocable: false`) registered
 * on each live Agent's own context, so the agent-scoped catalog that the `skill`
 * tool, the model catalog, `/name` gestures, and the `/` skill menu all read
 * reports it as unavailable — without touching the skill's files.
 */

export const name = 'skill-manager'

export const inject = ['skills', 'agents', 'tools', 'webServer', 'workingDirectory']

const STATE_ROUTE = '/skill-manager/api/state'
const ACTION_ROUTE = '/skill-manager/api/action'
const SHADOW_PROVIDER = 'skill-manager'
const MAX_BODY_BYTES = 256 * 1024
const MAX_BATCH = 500
const BATCH_OPS = new Set(['enable', 'disable', 'assign', 'ungroup'])
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DISABLED_CONTENT = [
  'This skill is turned off in the SKILL Manager panel, so its instructions are not available.',
  'Turn the skill back on in the SKILL Manager panel to make it usable again.',
].join(' ')

/**
 * Install the state store, the disabled-skill shadow providers, the panel API
 * routes, and the agent-facing `skill_manager` tool.
 * @param ctx - Host plugin context.
 */
export function apply(ctx) {
  const store = {
    stateFile: path.join(dshHome(), 'skill-manager.json'),
    state: null,
    loading: null,
    shadows: new Map(),
  }

  // Shadow providers exist so consumers that resolve skills for one agent see
  // the disabled policy flag; the invalidation control lets a toggle refresh
  // their catalog without reloading the plugin.
  for (const agent of safeAgents(ctx)) attachShadow(ctx, store, agent)
  ctx.on('agent/created', ({ agent }) => attachShadow(ctx, store, agent))

  ctx.effect(() => () => {
    for (const entry of [...store.shadows.values()]) {
      try {
        entry.dispose?.()
      } catch {
        // The agent context may already be gone.
      }
    }
    store.shadows.clear()
  }, 'skill-manager shadows')

  const webServer = optionalService(ctx, 'webServer')
  if (webServer === undefined) {
    warn(ctx, 'no web server in this composition; the panel API is unavailable')
  } else {
    ctx.effect(
      () => webServer.register({
        kind: 'exact',
        path: STATE_ROUTE,
        handler: (req, res) => handleState(ctx, store, req, res),
      }),
      'skill-manager state route',
    )
    ctx.effect(
      () => webServer.register({
        kind: 'exact',
        path: ACTION_ROUTE,
        handler: (req, res) => handleAction(ctx, store, req, res),
      }),
      'skill-manager action route',
    )
  }

  ctx.tools.register(createTool(ctx, store))
}

function createTool(ctx, store) {
  return {
    name: 'skill_manager',
    description:
      'Manage the skills installed in this Harness. "list" shows every skill with its group and on/off state. ' +
      'Turning a skill off keeps its files but removes it from the session skill catalog and from / skill commands; ' +
      'turning it on restores it. Groups are organizational only and never change skill behavior.',
    parameters: {
      type: 'object',
      additionalProperties: false,
      required: ['action'],
      properties: {
        action: {
          type: 'string',
          enum: ['list', 'enable', 'disable', 'create_group', 'rename_group', 'delete_group', 'assign', 'batch', 'reorder_groups'],
          description:
            'The operation: list skills; enable or disable one skill; create, rename, reorder, or delete groups; ' +
            'assign one skill; or batch-apply an operation to many skills.',
        },
        name: {
          type: 'string',
          description: 'Exact kebab-case skill name, required by enable, disable, and assign.',
        },
        names: {
          type: 'array',
          items: { type: 'string' },
          description: 'Exact skill names for action "batch".',
        },
        op: {
          type: 'string',
          enum: ['enable', 'disable', 'assign', 'ungroup'],
          description: 'Batch operation, required by action "batch".',
        },
        group: {
          type: 'string',
          description:
            'Group name: the new name for create_group, the target group for assign and batch assign, or the group to rename/delete ' +
            'when group_id is omitted. assign or batch ungroup with an empty string moves skills back to ungrouped.',
        },
        group_id: {
          type: 'string',
          description: 'Exact group id; accepted anywhere a group is named.',
        },
        to: {
          type: 'string',
          description: 'New group name, required by rename_group.',
        },
        ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Ordered group ids for reorder_groups; must list every group exactly once.',
        },
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['summary'],
        properties: {
          summary: { type: 'string' },
        },
      },
      render: (_args, value) => [{ type: 'text', text: String(value?.summary ?? '') }],
    },
    async execute(args) {
      const payload = await runAction(ctx, store, args ?? {})
      return { summary: summarize(payload) }
    },
  }
}

/**
 * Register one scope-local provider on a live Agent context. The provider wins
 * the disabled names inside that Agent's layer, so the summaries the Agent's
 * consumers read carry `modelInvocable: false` and `userInvocable: false`.
 */
function attachShadow(ctx, store, agent) {
  if (agent === undefined || agent === null || store.shadows.has(agent.id)) return
  const agentCtx = agent.ctx
  if (agentCtx === undefined || agentCtx === null) return
  const skills = optionalService(agentCtx, 'skills')
  if (skills === undefined) return
  const entry = { control: null, dispose: null }
  store.shadows.set(agent.id, entry)
  try {
    entry.dispose = agentCtx.effect(() => {
      const disposeProvider = skills.registerProvider((control) => {
        entry.control = control
        return createShadowProvider(store)
      })
      return () => {
        entry.control = null
        try {
          disposeProvider()
        } catch {
          // The registry may already be torn down.
        }
        store.shadows.delete(agent.id)
      }
    }, 'skill-manager disabled skills')
  } catch (error) {
    store.shadows.delete(agent.id)
    warn(ctx, `could not shadow skills for one agent: ${messageOf(error)}`)
  }
}

function createShadowProvider(store) {
  return {
    name: SHADOW_PROVIDER,
    async list() {
      const state = await ensureState(store)
      const candidates = []
      for (const skillName of state.disabled) {
        const meta = state.meta[skillName]
        if (meta === undefined || typeof meta.description !== 'string' || meta.description.trim() === '') continue
        candidates.push({
          name: skillName,
          description: meta.description,
          ...(meta.whenToUse === undefined ? {} : { whenToUse: meta.whenToUse }),
          invocation: { modelInvocable: false, userInvocable: false },
          source: meta.source ?? 'custom',
          provider: SHADOW_PROVIDER,
          rank: 0,
          locator: { skillName, meta },
          ...(meta.path === undefined ? {} : { path: meta.path }),
          ...(meta.resourceBase === undefined ? {} : { resourceBase: meta.resourceBase }),
        })
      }
      return candidates
    },
    async get(candidate) {
      const meta = candidate?.locator?.meta ?? {}
      const summary = await ensureState(store).then(
        (state) => state.meta[candidate.name] ?? meta,
        () => meta,
      )
      const description = typeof summary.description === 'string' && summary.description.trim() !== ''
        ? summary.description
        : `The skill "${candidate.name}" is turned off in Skill Manager.`
      return {
        name: candidate.name,
        description,
        ...(summary.whenToUse === undefined ? {} : { whenToUse: summary.whenToUse }),
        invocation: { modelInvocable: false, userInvocable: false },
        source: summary.source ?? 'custom',
        provider: SHADOW_PROVIDER,
        content: DISABLED_CONTENT,
        ...(summary.path === undefined ? {} : { path: summary.path }),
        ...(summary.resourceBase === undefined ? {} : { resourceBase: summary.resourceBase }),
      }
    },
  }
}

// ---------------------------------------------------------------------------
// State

function emptyState() {
  return { version: 1, groups: [], assignments: {}, disabled: [], meta: {} }
}

async function ensureState(store) {
  if (store.state !== null) return store.state
  store.loading ??= readState(store.stateFile).then((state) => {
    store.state = state
    return state
  })
  return store.loading
}

async function readState(stateFile) {
  let raw
  try {
    raw = await fsp.readFile(stateFile, 'utf8')
  } catch {
    return emptyState()
  }
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return emptyState()
  }
  return normalizeState(parsed)
}

function normalizeState(parsed) {
  const state = emptyState()
  const seenIds = new Set()
  const seenNames = new Set()
  const groups = Array.isArray(parsed?.groups) ? parsed.groups : []
  for (const group of groups) {
    if (group === null || typeof group !== 'object') continue
    const groupName = typeof group.name === 'string' ? group.name.trim().slice(0, 40) : ''
    if (groupName === '') continue
    const key = groupName.toLowerCase()
    if (seenNames.has(key)) continue
    let id = typeof group.id === 'string' ? group.id.trim() : ''
    if (id === '' || seenIds.has(id)) id = `g-${randomUUID().slice(0, 8)}`
    seenIds.add(id)
    seenNames.add(key)
    state.groups.push({ id, name: groupName })
  }
  if (parsed !== null && typeof parsed === 'object' && typeof parsed.assignments === 'object' && parsed.assignments !== null) {
    for (const [skillName, groupId] of Object.entries(parsed.assignments)) {
      if (!SKILL_NAME.test(skillName)) continue
      if (typeof groupId !== 'string' || !seenIds.has(groupId)) continue
      state.assignments[skillName] = groupId
    }
  }
  state.disabled = [...new Set(stringList(parsed?.disabled).filter((entry) => SKILL_NAME.test(entry)))]
  if (parsed !== null && typeof parsed === 'object' && typeof parsed.meta === 'object' && parsed.meta !== null) {
    for (const [skillName, value] of Object.entries(parsed.meta)) {
      if (!SKILL_NAME.test(skillName) || value === null || typeof value !== 'object') continue
      state.meta[skillName] = pickMeta(value)
    }
  }
  return state
}

async function saveState(stateFile, state) {
  await fsp.mkdir(path.dirname(stateFile), { recursive: true })
  const temporary = `${stateFile}.${process.pid}.tmp`
  await fsp.writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
  await fsp.rename(temporary, stateFile)
}

function pickMeta(value) {
  const meta = {}
  if (typeof value.description === 'string' && value.description.trim() !== '') meta.description = value.description
  if (typeof value.whenToUse === 'string' && value.whenToUse !== '') meta.whenToUse = value.whenToUse
  if (typeof value.source === 'string' && value.source !== '') meta.source = value.source
  if (typeof value.provider === 'string' && value.provider !== '') meta.provider = value.provider
  if (typeof value.path === 'string' && value.path !== '') meta.path = value.path
  const base = value.resourceBase
  if (base !== null && typeof base === 'object') {
    if (base.kind === 'directory' && typeof base.path === 'string') meta.resourceBase = { kind: 'directory', path: base.path }
    else if (base.kind === 'url' && typeof base.url === 'string') meta.resourceBase = { kind: 'url', url: base.url }
    else if (base.kind === 'opaque' && typeof base.description === 'string') {
      meta.resourceBase = { kind: 'opaque', description: base.description }
    }
  }
  return meta
}

// ---------------------------------------------------------------------------
// Catalog

/**
 * Read the invocation-neutral catalog the same way consumers do: once for the
 * process-global layer and once inside every live Agent's scope, where preset
 * mounted providers and this plugin's own shadows live.
 * @returns winning summaries by name plus discovery completeness.
 */
async function collectCatalog(ctx, store, signal) {
  const byName = new Map()
  let complete = true
  let agents = 0
  const skills = optionalService(ctx, 'skills')
  if (skills === undefined) return { byName, complete: false, agents }
  try {
    const snapshot = await skills.snapshot({ signal })
    if (snapshot?.complete !== true) complete = false
    for (const skill of snapshot?.skills ?? []) byName.set(skill.name, skill)
  } catch (error) {
    complete = false
    warn(ctx, `global catalog read failed: ${messageOf(error)}`)
  }
  const workingDirectory = optionalService(ctx, 'workingDirectory')
  for (const agent of safeAgents(ctx)) {
    agents += 1
    let cwd
    try {
      cwd = workingDirectory?.get(agent.session)
    } catch {
      cwd = undefined
    }
    try {
      const snapshot = await skills.snapshot({ cwd, scope: agent, signal })
      if (snapshot?.complete !== true) complete = false
      for (const skill of snapshot?.skills ?? []) byName.set(skill.name, skill)
    } catch (error) {
      complete = false
      warn(ctx, `agent catalog read failed: ${messageOf(error)}`)
    }
  }
  return { byName, complete, agents }
}

function buildSkills(state, byName) {
  const disabled = new Set(state.disabled)
  const skills = []
  for (const [skillName, summary] of byName) {
    const meta = state.meta[skillName]
    const enabled = !disabled.has(skillName)
    const description = enabled
      ? summary.description
      : (meta?.description ?? summary.description)
    const source = enabled ? summary.source : (meta?.source ?? summary.source)
    const provider = enabled ? summary.provider : (meta?.provider ?? summary.provider)
    const skillPath = enabled ? summary.path : (meta?.path ?? summary.path)
    skills.push({
      name: skillName,
      description: typeof description === 'string' ? description : '',
      whenToUse: typeof (enabled ? summary.whenToUse : meta?.whenToUse) === 'string' ? (enabled ? summary.whenToUse : meta?.whenToUse) : '',
      source: typeof source === 'string' ? source : '',
      provider: typeof provider === 'string' ? provider : '',
      path: typeof skillPath === 'string' ? skillPath : '',
      enabled,
      available: true,
      resolvedBy: typeof summary.provider === 'string' ? summary.provider : '',
      modelInvocable: summary.invocation?.modelInvocable !== false,
      userInvocable: summary.invocation?.userInvocable !== false,
      groupId: state.assignments[skillName] ?? null,
    })
  }
  for (const skillName of state.disabled) {
    if (byName.has(skillName)) continue
    const meta = state.meta[skillName] ?? {}
    skills.push({
      name: skillName,
      description: typeof meta.description === 'string' ? meta.description : '',
      whenToUse: typeof meta.whenToUse === 'string' ? meta.whenToUse : '',
      source: typeof meta.source === 'string' ? meta.source : '',
      provider: typeof meta.provider === 'string' ? meta.provider : '',
      path: typeof meta.path === 'string' ? meta.path : '',
      enabled: false,
      available: false,
      resolvedBy: '',
      modelInvocable: false,
      userInvocable: false,
      groupId: state.assignments[skillName] ?? null,
    })
  }
  skills.sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))
  return skills
}

async function buildPayload(ctx, store) {
  const state = await ensureState(store)
  const catalog = await collectCatalog(ctx, store)
  const skills = buildSkills(state, catalog.byName)
  const enabled = skills.reduce((total, skill) => total + (skill.enabled ? 1 : 0), 0)
  return {
    ok: true,
    statePath: store.stateFile,
    groups: state.groups.map((group) => ({ id: group.id, name: group.name })),
    skills,
    stats: {
      total: skills.length,
      enabled,
      disabled: skills.length - enabled,
      liveAgents: catalog.agents,
      complete: catalog.complete,
      scannedAt: Date.now(),
    },
  }
}

// ---------------------------------------------------------------------------
// Actions

async function runAction(ctx, store, input) {
  const action = typeof input?.action === 'string' ? input.action.trim() : ''
  const state = await ensureState(store)
  let changed = false
  let result = null
  if (action === 'list') return buildPayload(ctx, store)
  if (action === 'enable' || action === 'disable') {
    const skillName = requireSkillName(input?.name)
    if (action === 'enable') {
      if (state.disabled.includes(skillName)) {
        state.disabled = state.disabled.filter((entry) => entry !== skillName)
        delete state.meta[skillName]
        changed = true
      }
    } else if (!state.disabled.includes(skillName)) {
      const summary = (await collectCatalog(ctx, store)).byName.get(skillName)
      if (summary === undefined) {
        throw new Error(`unknown skill "${skillName}"; call skill_manager with action "list" to read the exact names`)
      }
      state.disabled.push(skillName)
      state.meta[skillName] = pickMeta(summary)
      changed = true
    }
  } else if (action === 'batch') {
    const batch = await applyBatch(ctx, store, state, input)
    changed = batch.changed
    result = batch.result
  } else if (action === 'create_group') {
    const groupName = requireGroupName(input?.group)
    if (state.groups.some((group) => group.name.toLowerCase() === groupName.toLowerCase())) {
      throw new Error(`a group named "${groupName}" already exists`)
    }
    state.groups.push({ id: `g-${randomUUID().slice(0, 8)}`, name: groupName })
    changed = true
  } else if (action === 'rename_group') {
    const groupId = resolveGroupId(state, input?.group_id, input?.group)
    const nextName = requireGroupName(input?.to)
    const duplicate = state.groups.find(
      (group) => group.id !== groupId && group.name.toLowerCase() === nextName.toLowerCase(),
    )
    if (duplicate !== undefined) throw new Error(`a group named "${nextName}" already exists`)
    const target = state.groups.find((group) => group.id === groupId)
    if (target !== undefined && target.name !== nextName) {
      target.name = nextName
      changed = true
    }
  } else if (action === 'delete_group') {
    const groupId = resolveGroupId(state, input?.group_id, input?.group)
    state.groups = state.groups.filter((group) => group.id !== groupId)
    for (const [skillName, assigned] of Object.entries(state.assignments)) {
      if (assigned === groupId) delete state.assignments[skillName]
    }
    changed = true
  } else if (action === 'assign') {
    const skillName = requireSkillName(input?.name)
    const catalog = await collectCatalog(ctx, store)
    if (!catalog.byName.has(skillName)) {
      throw new Error(`unknown skill "${skillName}"; call skill_manager with action "list" to read the exact names`)
    }
    const target = typeof input?.group_id === 'string' && input.group_id.trim() !== ''
      ? input.group_id.trim()
      : (typeof input?.group === 'string' ? input.group.trim() : '')
    if (target === '' || target.toLowerCase() === 'none') {
      if (state.assignments[skillName] !== undefined) {
        delete state.assignments[skillName]
        changed = true
      }
    } else {
      const groupId = resolveGroupId(state, undefined, target)
      if (state.assignments[skillName] !== groupId) {
        state.assignments[skillName] = groupId
        changed = true
      }
    }
  } else if (action === 'reorder_groups') {
    changed = reorderGroups(state, input?.ids)
  } else {
    throw new Error(
      'unknown action "' + action + '"; expected list, enable, disable, batch, create_group, rename_group, ' +
      'delete_group, assign, or reorder_groups',
    )
  }
  if (changed) {
    await saveState(store.stateFile, state)
    store.state = state
    invalidateShadows(store)
  }
  const payload = await buildPayload(ctx, store)
  if (result !== null) payload.result = result
  return payload
}

/**
 * Apply one operation to many skills. Unknown or already-settled names are
 * reported as skipped instead of failing the whole batch, so one stale name
 * from a client selection cannot block the rest.
 */
async function applyBatch(ctx, store, state, input) {
  const op = typeof input?.op === 'string' ? input.op.trim() : ''
  if (!BATCH_OPS.has(op)) throw new Error('batch op must be enable, disable, assign, or ungroup')
  const names = [...new Set(stringList(input?.names))].slice(0, MAX_BATCH)
  if (names.length === 0) throw new Error('batch names must list at least one skill')
  const invalid = names.filter((name) => !SKILL_NAME.test(name))
  if (invalid.length > 0) throw new Error(`invalid skill names: ${invalid.slice(0, 5).join(', ')}`)
  const catalog = await collectCatalog(ctx, store)
  const groupId = op === 'assign' ? resolveGroupId(state, input?.group_id, input?.group) : null
  const applied = []
  const skipped = []
  for (const skillName of names) {
    if (!catalog.byName.has(skillName)) {
      skipped.push(skillName)
      continue
    }
    if (op === 'enable') {
      if (!state.disabled.includes(skillName)) {
        skipped.push(skillName)
        continue
      }
      state.disabled = state.disabled.filter((entry) => entry !== skillName)
      delete state.meta[skillName]
      applied.push(skillName)
    } else if (op === 'disable') {
      if (state.disabled.includes(skillName)) {
        skipped.push(skillName)
        continue
      }
      state.disabled.push(skillName)
      state.meta[skillName] = pickMeta(catalog.byName.get(skillName))
      applied.push(skillName)
    } else if (op === 'assign') {
      if (state.assignments[skillName] === groupId) {
        skipped.push(skillName)
        continue
      }
      state.assignments[skillName] = groupId
      applied.push(skillName)
    } else if (state.assignments[skillName] === undefined) {
      skipped.push(skillName)
    } else {
      delete state.assignments[skillName]
      applied.push(skillName)
    }
  }
  return { changed: applied.length > 0, result: { op, applied, skipped, groupId } }
}

/** Reorder groups to the exact id order; anything but a full permutation throws. */
function reorderGroups(state, rawIds) {
  const ids = Array.isArray(rawIds) ? rawIds.filter((id) => typeof id === 'string') : []
  const current = state.groups.map((group) => group.id)
  if (ids.length !== current.length || new Set(ids).size !== ids.length) {
    throw new Error('reorder_groups needs every group id exactly once')
  }
  const byId = new Map(state.groups.map((group) => [group.id, group]))
  const ordered = []
  for (const id of ids) {
    const group = byId.get(id)
    if (group === undefined) throw new Error(`unknown group id "${id}"`)
    ordered.push(group)
  }
  if (ordered.every((group, index) => group === state.groups[index])) return false
  state.groups = ordered
  return true
}

function requireSkillName(value) {
  const skillName = typeof value === 'string' ? value.trim() : ''
  if (!SKILL_NAME.test(skillName)) {
    throw new Error(`"${String(value)}" is not a valid skill name; pass the exact kebab-case name from the skill list`)
  }
  return skillName
}

function requireGroupName(value) {
  const groupName = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
  if (groupName === '') throw new Error('a group name is required')
  if (groupName.length > 40) throw new Error('a group name must be 40 characters or fewer')
  return groupName
}

function resolveGroupId(state, rawId, rawName) {
  const id = typeof rawId === 'string' ? rawId.trim() : ''
  if (id !== '') {
    if (state.groups.some((group) => group.id === id)) return id
    throw new Error(`unknown group id "${id}"; read the current ids with skill_manager action "list"`)
  }
  const groupName = typeof rawName === 'string' ? rawName.trim() : ''
  if (groupName === '') throw new Error('a group name or id is required')
  const match = state.groups.find((group) => group.name.toLowerCase() === groupName.toLowerCase())
  if (match !== undefined) return match.id
  // Accept an id in the name slot too: the panel's group picker sends the
  // selected option value, and any caller holding an id should not need to
  // know which field the switch uses.
  const byId = state.groups.find((group) => group.id === groupName)
  if (byId !== undefined) return byId.id
  throw new Error(`unknown group "${groupName}"; read the current group names with skill_manager action "list"`)
}

function invalidateShadows(store) {
  for (const entry of store.shadows.values()) {
    try {
      entry.control?.invalidate()
    } catch {
      // A disposed registration simply has no live catalog to refresh.
    }
  }
}

function summarize(payload) {
  const lines = [
    `${payload.stats.enabled} of ${payload.stats.total} skills are on` +
      (payload.stats.complete ? '.' : ' (catalog discovery was incomplete; values may be stale).'),
  ]
  if (payload.result !== undefined && payload.result !== null) {
    const applied = Array.isArray(payload.result.applied) ? payload.result.applied.length : 0
    const skipped = Array.isArray(payload.result.skipped) ? payload.result.skipped.length : 0
    lines.push(`Batch ${payload.result.op}: ${applied} applied, ${skipped} skipped.`)
  }
  const buckets = new Map([['', []]])
  for (const group of payload.groups) buckets.set(group.id, [])
  for (const skill of payload.skills) {
    const key = skill.groupId !== null && buckets.has(skill.groupId) ? skill.groupId : ''
    buckets.get(key).push(skill)
  }
  const emit = (title, items) => {
    if (items.length === 0) return
    lines.push('', `${title}:`)
    for (const skill of items) {
      const state = skill.enabled ? 'on' : 'off'
      const missing = skill.available === false ? ' (missing)' : ''
      lines.push(`- ${skill.name} [${state}]${missing}`)
    }
  }
  emit('Ungrouped', buckets.get(''))
  for (const group of payload.groups) emit(group.name, buckets.get(group.id) ?? [])
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// HTTP

async function handleState(ctx, store, req, res) {
  const method = String(req.method ?? 'GET').toUpperCase()
  if (method !== 'GET' && method !== 'HEAD') {
    send(res, 405, { ok: false, error: 'method not allowed' })
    return
  }
  if (method === 'HEAD') {
    res.writeHead(204, { 'cache-control': 'no-store' })
    res.end()
    return
  }
  try {
    send(res, 200, await buildPayload(ctx, store))
  } catch (error) {
    send(res, 500, { ok: false, error: messageOf(error) })
  }
}

async function handleAction(ctx, store, req, res) {
  if (String(req.method ?? '').toUpperCase() !== 'POST') {
    send(res, 405, { ok: false, error: 'method not allowed' })
    return
  }
  const contentType = String(req.headers['content-type'] ?? '').toLowerCase()
  if (!contentType.startsWith('application/json')) {
    send(res, 415, { ok: false, error: 'expected an application/json body' })
    return
  }
  try {
    const body = await readJsonBody(req)
    send(res, 200, await runAction(ctx, store, body))
  } catch (error) {
    send(res, 400, { ok: false, error: messageOf(error) })
  }
}

async function readJsonBody(req) {
  let size = 0
  const chunks = []
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new Error('request body is too large')
    chunks.push(chunk)
  }
  if (size === 0) return {}
  const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('expected a JSON object')
  return parsed
}

function send(res, status, value) {
  const text = JSON.stringify(value)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(text),
  })
  res.end(text)
}

// ---------------------------------------------------------------------------
// Helpers

function optionalService(ctx, key) {
  try {
    return ctx.get(key)
  } catch {
    return undefined
  }
}

function safeAgents(ctx) {
  try {
    return ctx.agents.list()
  } catch {
    return []
  }
}

function stringList(value) {
  if (!Array.isArray(value)) return []
  return value.filter((entry) => typeof entry === 'string' && entry.trim() !== '').map((entry) => entry.trim())
}

function dshHome() {
  const configured = process.env.DSH_HOME
  if (typeof configured === 'string' && configured.trim() !== '') return configured
  return path.join(os.homedir(), '.dsh')
}

function warn(ctx, message) {
  try {
    ctx.logger?.warn(`skill-manager: ${message}`)
  } catch {
    // Logging must never fail the plugin.
  }
}

function messageOf(error) {
  try {
    if (error instanceof Error) return error.message
  } catch {
    // Fall through to string coercion.
  }
  return String(error)
}
