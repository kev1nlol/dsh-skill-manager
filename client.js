window.__ModuleLoader__.load({
  id: '@kev1nlol/dsh-skill-manager',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'skill-manager'
    const PANEL_ID = 'skill-manager'
    const STATE_URL = '/skill-manager/api/state'
    const ACTION_URL = '/skill-manager/api/action'

    const ZH = {
      'nav.title': 'SKILL 管理',
      'page.title': 'SKILL 管理',
      'page.subtitle': '给技能分组、启用或关闭技能。关闭后技能文件保留，但不会再出现在技能目录与 / 指令里。',
      'page.refresh': '刷新',
      'page.loading': '正在读取技能…',
      'page.empty': '还没有发现任何技能。',
      'page.emptyGroup': '暂无技能',
      'page.ungrouped': '未分组',
      'page.newGroup': '新分组名称',
      'page.addGroup': '新建分组',
      'page.deleteGroup': '删除分组',
      'page.confirmDeleteGroup': '确认删除分组',
      'page.deleteHint': '只删除这个分组：组内技能会回到「未分组」，技能本身、启用状态和文件都不会改变。',
      'page.groupPicker': '移动到分组',
      'page.cancel': '取消',
      'page.on': '已启用',
      'page.off': '已关闭',
      'page.missing': '来源已不存在',
      'page.statEnabled': '已启用',
      'page.statDisabled': '已关闭',
      'page.statTotal': '共',
      'page.footer': '分组只是给你自己归类用的记录：它不改变技能是否启用、是否被索引、加载什么内容，也不影响任何其他行为。只有「已启用 / 已关闭」开关会改变索引状态，而且开关也不会删除或修改技能文件。',
      'page.errorFetch': '无法连接宿主服务。',
      'page.hintFetch': '请通过 Web 界面的 http 地址打开本页并刷新；如果仍然失败，请查看 Harness 日志。',
      'page.retry': '重试',
      'page.groupHint': '删除分组不会删除技能，组内技能会回到未分组。',
      'page.incomplete': '目录扫描不完整，结果可能有遗漏。',
      'page.noAgent': '当前没有活动会话，技能来源可能列不全。',
      'page.savedTo': '状态文件',
    }

    const EN = {
      'nav.title': 'SKILL Manager',
      'page.title': 'SKILL Manager',
      'page.subtitle': 'Group skills and turn them on or off. A skill turned off keeps its files but leaves the skill catalog and the / skill commands.',
      'page.refresh': 'Refresh',
      'page.loading': 'Reading skills…',
      'page.empty': 'No skills were discovered yet.',
      'page.emptyGroup': 'No skills',
      'page.ungrouped': 'Ungrouped',
      'page.newGroup': 'New group name',
      'page.addGroup': 'Create group',
      'page.deleteGroup': 'Delete group',
      'page.confirmDeleteGroup': 'Confirm delete group',
      'page.deleteHint': 'Deletes only this group: its skills move back to Ungrouped, and the skills themselves, their on/off state, and their files stay untouched.',
      'page.groupPicker': 'Move to group',
      'page.cancel': 'Cancel',
      'page.on': 'On',
      'page.off': 'Off',
      'page.missing': 'source missing',
      'page.statEnabled': 'on',
      'page.statDisabled': 'off',
      'page.statTotal': 'total',
      'page.footer': 'Groups are pure bookkeeping for you: they never change whether a skill is on, whether it is indexed, what it loads, or any other behavior. The on/off switch is the only thing that changes indexing, and it deletes or edits no skill file.',
      'page.errorFetch': 'Cannot reach the host service.',
      'page.hintFetch': 'Open this page through the Web GUI http address and reload; if it still fails, check the Harness log.',
      'page.retry': 'Retry',
      'page.groupHint': 'Deleting a group never deletes skills; its members move back to ungrouped.',
      'page.incomplete': 'Catalog discovery was incomplete, so this list may miss skills.',
      'page.noAgent': 'No live session right now, so skill sources may be incomplete.',
      'page.savedTo': 'State file',
    }

    const S = {
      page: {
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
        background: 'var(--dsw-alias-bg-base)',
        color: 'var(--dsw-alias-label-primary)',
        padding: '28px 28px 48px',
      },
      inner: { maxWidth: 940, margin: '0 auto' },
      header: { display: 'flex', alignItems: 'flex-start', gap: 16, justifyContent: 'space-between' },
      title: { margin: 0, fontSize: 20, fontWeight: 600, lineHeight: '28px' },
      subtitle: {
        margin: '6px 0 0',
        fontSize: 13,
        lineHeight: '20px',
        color: 'var(--dsw-alias-label-secondary)',
        maxWidth: 620,
      },
      stats: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 14,
        marginTop: 14,
        fontSize: 12,
        color: 'var(--dsw-alias-label-secondary)',
      },
      statValue: { color: 'var(--dsw-alias-label-primary)', fontWeight: 600 },
      button: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 30,
        padding: '0 12px',
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-border-l2)',
        background: 'transparent',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: 12,
        cursor: 'pointer',
        flex: '0 0 auto',
      },
      buttonPrimary: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 30,
        padding: '0 12px',
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-brand-primary)',
        background: 'transparent',
        color: 'var(--dsw-alias-brand-primary)',
        font: 'inherit',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        flex: '0 0 auto',
      },
      buttonQuiet: {
        display: 'inline-flex',
        alignItems: 'center',
        height: 24,
        padding: '0 8px',
        borderRadius: 6,
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'transparent',
        color: 'var(--dsw-alias-label-secondary)',
        font: 'inherit',
        fontSize: 11,
        cursor: 'pointer',
        flex: '0 0 auto',
      },
      input: {
        height: 30,
        width: 220,
        boxSizing: 'border-box',
        padding: '0 10px',
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-layer-1)',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: 12,
        outline: 'none',
      },
      toolbar: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20, alignItems: 'center' },
      banner: {
        marginTop: 16,
        padding: '10px 12px',
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-state-error-primary)',
        color: 'var(--dsw-alias-state-error-primary)',
        fontSize: 12,
        lineHeight: '18px',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
      },
      notice: {
        marginTop: 16,
        padding: '10px 12px',
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-layer-1)',
        color: 'var(--dsw-alias-label-secondary)',
        fontSize: 12,
        lineHeight: '18px',
      },
      section: { marginTop: 22 },
      sectionHead: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 2px 8px' },
      sectionTitle: { fontSize: 13, fontWeight: 600, color: 'var(--dsw-alias-label-primary)' },
      sectionCount: { fontSize: 12, color: 'var(--dsw-alias-label-secondary)' },
      sectionHint: {
        fontSize: 11,
        lineHeight: '16px',
        color: 'var(--dsw-alias-label-secondary)',
        textAlign: 'right',
        flex: '0 1 auto',
      },
      card: {
        border: '1px solid var(--dsw-alias-border-l1)',
        borderRadius: 10,
        overflow: 'hidden',
        background: 'var(--dsw-alias-bg-layer-1)',
      },
      row: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px' },
      rowDivider: { borderTop: '1px solid var(--dsw-alias-border-l1)' },
      rowMain: { flex: '1 1 auto', minWidth: 0 },
      rowTitle: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
      skillName: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--dsw-alias-label-primary)',
      },
      description: {
        marginTop: 4,
        fontSize: 12,
        lineHeight: '18px',
        color: 'var(--dsw-alias-label-secondary)',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      },
      badge: {
        display: 'inline-flex',
        alignItems: 'center',
        height: 18,
        padding: '0 6px',
        borderRadius: 6,
        border: '1px solid var(--dsw-alias-border-l1)',
        color: 'var(--dsw-alias-label-secondary)',
        fontSize: 10,
        lineHeight: '16px',
        whiteSpace: 'nowrap',
      },
      badgeWarn: {
        display: 'inline-flex',
        alignItems: 'center',
        height: 18,
        padding: '0 6px',
        borderRadius: 6,
        border: '1px solid var(--dsw-alias-state-warn-primary)',
        color: 'var(--dsw-alias-state-warn-primary)',
        fontSize: 10,
        lineHeight: '16px',
        whiteSpace: 'nowrap',
      },
      select: {
        height: 28,
        maxWidth: 150,
        boxSizing: 'border-box',
        padding: '0 6px',
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-layer-2)',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: 12,
        flex: '0 0 auto',
      },
      muted: { fontSize: 12, color: 'var(--dsw-alias-label-secondary)', lineHeight: '18px' },
      emptyRow: { padding: '12px 14px', fontSize: 12, color: 'var(--dsw-alias-label-secondary)' },
      footer: {
        marginTop: 26,
        paddingTop: 14,
        borderTop: '1px solid var(--dsw-alias-border-l1)',
        fontSize: 11,
        lineHeight: '18px',
        color: 'var(--dsw-alias-label-secondary)',
        overflowWrap: 'anywhere',
      },
    }

    function messageOf(failure) {
      if (failure !== null && typeof failure === 'object') {
        const text = failure.message
        if (typeof text === 'string' && text !== '') return text
      }
      return String(failure)
    }

    async function request(url, body) {
      const options = body === undefined
        ? { method: 'GET', credentials: 'same-origin', headers: { accept: 'application/json' } }
        : {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify(body),
        }
      let response
      try {
        response = await fetch(url, options)
      } catch (cause) {
        const failure = new Error('network request failed')
        failure.network = true
        failure.cause = cause
        throw failure
      }
      const text = await response.text()
      let payload = null
      if (text !== '') {
        try {
          payload = JSON.parse(text)
        } catch {
          payload = null
        }
      }
      if (!response.ok || payload === null || payload.ok === false) {
        const detail = payload !== null && typeof payload.error === 'string' ? payload.error : text
        throw new Error(detail !== '' ? detail : `HTTP ${response.status}`)
      }
      return payload
    }

    function Badge(props) {
      return h('span', { style: props.warn === true ? S.badgeWarn : S.badge }, props.children)
    }

    function Stat(props) {
      return h('span', null, `${props.label} `, h('span', { style: S.statValue }, String(props.value)))
    }

    function Toggle(props) {
      const t = props.t
      const on = props.on === true
      const disabled = props.disabled === true
      return h('button', {
        type: 'button',
        role: 'switch',
        'aria-checked': on ? 'true' : 'false',
        'aria-label': on ? t('page.on') : t('page.off'),
        title: on ? t('page.on') : t('page.off'),
        disabled,
        onClick: props.onClick,
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 26,
          padding: '0 10px',
          borderRadius: 13,
          border: `1px solid ${on ? 'var(--dsw-alias-state-success-primary)' : 'var(--dsw-alias-border-l2)'}`,
          background: 'transparent',
          color: on ? 'var(--dsw-alias-state-success-primary)' : 'var(--dsw-alias-state-idle-primary)',
          font: 'inherit',
          fontSize: 11,
          fontWeight: 600,
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.55 : 1,
          flex: '0 0 auto',
          whiteSpace: 'nowrap',
        },
      }, h('span', {
        'aria-hidden': true,
        style: {
          width: 6,
          height: 6,
          borderRadius: 3,
          background: 'currentColor',
          display: 'inline-block',
          flex: '0 0 auto',
        },
      }), on ? t('page.on') : t('page.off'))
    }

    function SkillRow(props) {
      const t = props.t
      const skill = props.skill
      const busy = props.busy === true
      const title = [h('span', { key: 'name', style: S.skillName }, skill.name)]
      if (typeof skill.source === 'string' && skill.source !== '') {
        title.push(h(Badge, { key: 'source' }, skill.source))
      }
      if (skill.available === false) {
        title.push(h(Badge, { key: 'missing', warn: true }, t('page.missing')))
      }
      const children = [
        h('div', { key: 'main', style: S.rowMain }, [
          h('div', { key: 'title', style: S.rowTitle }, title),
          typeof skill.description === 'string' && skill.description !== ''
            ? h('div', { key: 'description', style: S.description }, skill.description)
            : null,
        ]),
        h('select', {
          key: 'group',
          value: typeof skill.groupId === 'string' ? skill.groupId : '',
          disabled: busy || props.groups.length === 0,
          onChange: (event) => props.onAssign(skill.name, event.target.value),
          style: S.select,
          title: t('page.groupPicker'),
          'aria-label': t('page.groupPicker'),
        }, [h('option', { key: '', value: '' }, t('page.ungrouped'))].concat(
          props.groups.map((group) => h('option', { key: group.id, value: group.id }, group.name)),
        )),
        h(Toggle, {
          key: 'toggle',
          t,
          on: skill.enabled,
          disabled: busy,
          onClick: () => props.onToggle(skill),
        }),
      ]
      return h('div', { style: props.first === true ? S.row : Object.assign({}, S.row, S.rowDivider) }, children)
    }

    function GroupSection(props) {
      const t = props.t
      const head = [
        h('span', { key: 'title', style: S.sectionTitle }, props.title),
        h('span', { key: 'count', style: S.sectionCount }, String(props.skills.length)),
      ]
      if (props.group !== null && props.group !== undefined) {
        const confirming = props.confirming === props.group.id
        head.push(h('span', { key: 'spacer', style: { flex: '1 1 auto' } }))
        // Name the target and the consequence on the control itself: deleting a
        // group only drops the label, never the skills inside it.
        if (confirming) {
          head.push(h('span', { key: 'hint', style: S.sectionHint }, t('page.deleteHint')))
          head.push(h('button', {
            key: 'cancel',
            type: 'button',
            style: S.buttonQuiet,
            onClick: () => props.onCancelDelete(),
          }, t('page.cancel')))
        }
        head.push(h('button', {
          key: 'delete',
          type: 'button',
          style: S.buttonQuiet,
          title: t('page.deleteHint'),
          onClick: () => props.onDelete(props.group, confirming),
        }, confirming ? t('page.confirmDeleteGroup') : t('page.deleteGroup')))
      }
      const rows = props.skills.length === 0
        ? [h('div', { key: 'empty', style: S.emptyRow }, t('page.emptyGroup'))]
        : props.skills.map((skill, index) => h(SkillRow, {
          key: skill.name,
          t,
          skill,
          groups: props.groups,
          busy: props.pending === `toggle:${skill.name}` || props.pending === `assign:${skill.name}`,
          first: index === 0,
          onToggle: props.onToggle,
          onAssign: props.onAssign,
        }))
      return h('section', { style: S.section }, [
        h('div', { key: 'head', style: S.sectionHead }, head),
        h('div', { key: 'body', style: S.card }, rows),
      ])
    }

    function createPage(t) {
      return function SkillManagerPage() {
        const [data, setData] = React.useState(null)
        const [status, setStatus] = React.useState('loading')
        const [error, setError] = React.useState('')
        const [pending, setPending] = React.useState('')
        const [draftGroup, setDraftGroup] = React.useState('')
        const [confirmGroup, setConfirmGroup] = React.useState('')
        const alive = React.useRef(true)

        React.useEffect(() => () => {
          alive.current = false
        }, [])

        const fail = React.useCallback((failure) => {
          const network = failure !== null && typeof failure === 'object' && failure.network === true
          setError(network ? `${t('page.errorFetch')} ${t('page.hintFetch')}` : messageOf(failure))
        }, [])

        const load = React.useCallback(async () => {
          setStatus((current) => (current === 'ready' ? current : 'loading'))
          setError('')
          try {
            const payload = await request(STATE_URL)
            if (!alive.current) return
            setData(payload)
            setStatus('ready')
          } catch (failure) {
            if (!alive.current) return
            fail(failure)
            setStatus('error')
          }
        }, [fail])

        React.useEffect(() => {
          load()
        }, [load])

        const act = React.useCallback(async (payload, token) => {
          setPending(token)
          setError('')
          try {
            const next = await request(ACTION_URL, payload)
            if (!alive.current) return
            setData(next)
            setStatus('ready')
            return true
          } catch (failure) {
            if (alive.current) fail(failure)
            return false
          } finally {
            if (alive.current) setPending('')
          }
        }, [fail])

        const onToggle = React.useCallback((skill) => {
          act({ action: skill.enabled ? 'disable' : 'enable', name: skill.name }, `toggle:${skill.name}`)
        }, [act])

        const onAssign = React.useCallback((name, groupId) => {
          // The picker's option value is the group id. Clearing sends an empty
          // group string, which the host reads as "move back to ungrouped".
          const payload = groupId === ''
            ? { action: 'assign', name, group: '', group_id: '' }
            : { action: 'assign', name, group_id: groupId }
          act(payload, `assign:${name}`)
        }, [act])

        const onCreateGroup = React.useCallback(async () => {
          const name = draftGroup.trim()
          if (name === '') return
          const changed = await act({ action: 'create_group', group: name }, 'group:create')
          if (changed && alive.current) setDraftGroup('')
        }, [act, draftGroup])

        const onDeleteGroup = React.useCallback(async (group, confirming) => {
          if (confirming) {
            const changed = await act({ action: 'delete_group', group_id: group.id }, `group:delete:${group.id}`)
            if (changed && alive.current) setConfirmGroup('')
            return
          }
          setConfirmGroup(group.id)
        }, [act])

        const groups = data !== null && Array.isArray(data.groups) ? data.groups : []
        const skills = data !== null && Array.isArray(data.skills) ? data.skills : []
        const stats = data !== null && data.stats !== null && typeof data.stats === 'object' ? data.stats : null

        const sections = []
        const byGroup = new Map()
        for (const group of groups) byGroup.set(group.id, [])
        const ungrouped = []
        for (const skill of skills) {
          if (typeof skill.groupId === 'string' && byGroup.has(skill.groupId)) byGroup.get(skill.groupId).push(skill)
          else ungrouped.push(skill)
        }
        // An empty Ungrouped section is pure noise once every skill lives in a
        // group, so it appears only while it actually holds something. A named
        // group stays visible when empty: that is where a freshly created group
        // waits for its first member.
        if (ungrouped.length > 0) {
          sections.push(h(GroupSection, {
            key: 'ungrouped',
            t,
            title: t('page.ungrouped'),
            group: null,
            groups,
            skills: ungrouped,
            pending,
            confirming: confirmGroup,
            onDelete: onDeleteGroup,
            onCancelDelete: () => setConfirmGroup(''),
            onToggle,
            onAssign,
          }))
        }
        for (const group of groups) {
          sections.push(h(GroupSection, {
            key: group.id,
            t,
            title: group.name,
            group,
            groups,
            skills: byGroup.get(group.id) ?? [],
            pending,
            confirming: confirmGroup,
            onDelete: onDeleteGroup,
            onCancelDelete: () => setConfirmGroup(''),
            onToggle,
            onAssign,
          }))
        }

        const header = h('header', { style: S.header }, [
          h('div', { key: 'titles', style: { minWidth: 0 } }, [
            h('h1', { key: 'title', style: S.title }, t('page.title')),
            h('p', { key: 'subtitle', style: S.subtitle }, t('page.subtitle')),
            h('div', { key: 'stats', style: S.stats }, stats === null ? [] : [
              h(Stat, { key: 'enabled', label: t('page.statEnabled'), value: stats.enabled }),
              h(Stat, { key: 'disabled', label: t('page.statDisabled'), value: stats.disabled }),
              h(Stat, { key: 'total', label: t('page.statTotal'), value: stats.total }),
            ]),
          ]),
          h('button', {
            key: 'refresh',
            type: 'button',
            style: Object.assign({}, S.button, { opacity: status === 'loading' ? 0.6 : 1 }),
            disabled: status === 'loading',
            onClick: () => load(),
          }, t('page.refresh')),
        ])

        const notices = []
        if (error !== '') {
          notices.push(h('div', { key: 'error', style: S.banner }, error))
        }
        if (stats !== null && stats.complete === false) {
          notices.push(h('div', { key: 'incomplete', style: S.notice }, t('page.incomplete')))
        }
        if (stats !== null && stats.liveAgents === 0) {
          notices.push(h('div', { key: 'noagent', style: S.notice }, t('page.noAgent')))
        }

        const toolbar = h('div', { style: S.toolbar }, [
          h('input', {
            key: 'draft',
            value: draftGroup,
            placeholder: t('page.newGroup'),
            'aria-label': t('page.newGroup'),
            maxLength: 40,
            style: S.input,
            disabled: pending === 'group:create',
            onChange: (event) => setDraftGroup(event.target.value),
            onKeyDown: (event) => {
              if (event.key === 'Enter') onCreateGroup()
            },
          }),
          h('button', {
            key: 'create',
            type: 'button',
            style: Object.assign({}, S.buttonPrimary, {
              opacity: draftGroup.trim() === '' || pending === 'group:create' ? 0.6 : 1,
            }),
            disabled: draftGroup.trim() === '' || pending === 'group:create',
            onClick: onCreateGroup,
          }, t('page.addGroup')),
        ])

        const body = status === 'loading' && data === null
          ? [h('div', { key: 'loading', style: Object.assign({}, S.muted, { marginTop: 24 }) }, t('page.loading'))]
          : status === 'error' && data === null
            ? [h('div', { key: 'failed', style: { marginTop: 20 } }, [
              h('button', {
                key: 'retry',
                type: 'button',
                style: S.button,
                onClick: () => load(),
              }, t('page.retry')),
            ])]
            : skills.length === 0
              ? [h('div', { key: 'empty', style: Object.assign({}, S.muted, { marginTop: 24 }) }, t('page.empty'))]
              : sections

        const footerText = typeof data?.statePath === 'string' && data.statePath !== ''
          ? `${t('page.footer')}  ${t('page.savedTo')}: ${data.statePath}`
          : t('page.footer')
        const footer = h('div', { style: S.footer }, footerText)

        return h('div', { style: S.page }, h('div', { style: S.inner }, [header, toolbar].concat(notices, body, [footer])))
      }
    }

    function createIcon() {
      return function SkillManagerIcon(props) {
        const size = props !== null && typeof props === 'object' && typeof props.size === 'number' ? props.size : 20
        const active = props !== null && typeof props === 'object' && props.active === true
        return h('svg', {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': true,
          style: { display: 'block', opacity: active ? 1 : 0.82 },
        }, [
          h('rect', { key: 'card', x: 3, y: 4.5, width: 13, height: 15, rx: 2.5, opacity: 0.55 }),
          h('path', { key: 'edge', d: 'M19 7.5v9a3 3 0 0 1-3 3H8' }),
          h('circle', { key: 'dot', cx: 9.5, cy: 14, r: 2.4 }),
          h('path', { key: 'check', d: 'M8.5 14.1l1.4 1.4 2.6-3' }),
          h('path', { key: 'line', d: 'M6.4 8.4h5.2' }),
        ])
      }
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, 'zh', ZH), 'skill-manager zh dictionary')
        ctx.effect(() => ctx.locale.register(NS, 'en', EN), 'skill-manager en dictionary')
        const t = ctx.locale.bind(NS)
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 15,
          label: () => t('nav.title'),
        }, createIcon()))
        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_ID,
        }, createPage(t)))
      },
    }
  },
})
