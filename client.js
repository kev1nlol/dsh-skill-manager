window.__ModuleLoader__.load({
  id: '@kev1nlol/dsh-skill-manager',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'skill-manager'
    const PANEL_ID = 'skill-manager'
    const STATE_URL = '/skill-manager/api/state'
    const ACTION_URL = '/skill-manager/api/action'
    const COLLAPSE_KEY = 'dsh:skill-manager:collapsed'

    const ZH = {
      'nav.title': 'SKILL 管理',
      'page.title': 'SKILL 管理',
      'page.subtitle': '给技能分组、批量或逐个启用关闭。关闭后技能文件保留，但不会再出现在技能目录与 / 指令里。',
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
      'page.incomplete': '目录扫描不完整，结果可能有遗漏。',
      'page.noAgent': '当前没有活动会话，技能来源可能列不全。',
      'page.savedTo': '状态文件',
      'page.selectOne': '选择此技能',
      'page.selectSection': '选择本节全部技能',
      'page.selected': '已选',
      'page.batchEnable': '批量启用',
      'page.batchDisable': '批量关闭',
      'page.batchMove': '移动到分组…',
      'page.batchUngroup': '移出分组',
      'page.batchClear': '取消选择',
      'page.collapse': '折叠',
      'page.expand': '展开',
      'page.collapseAll': '全部折叠',
      'page.expandAll': '全部展开',
      'page.rename': '重命名',
      'page.renameSave': '保存',
      'page.renameCancel': '取消',
      'page.renamePlaceholder': '分组名称',
      'page.dragHint': '拖动排序',
      'page.applied': '已应用',
      'page.skipped': '跳过',
    }

    const EN = {
      'nav.title': 'SKILL Manager',
      'page.title': 'SKILL Manager',
      'page.subtitle': 'Group skills and turn them on or off one by one or in bulk. A skill turned off keeps its files but leaves the skill catalog and the / skill commands.',
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
      'page.incomplete': 'Catalog discovery was incomplete, so this list may miss skills.',
      'page.noAgent': 'No live session right now, so skill sources may be incomplete.',
      'page.savedTo': 'State file',
      'page.selectOne': 'Select this skill',
      'page.selectSection': 'Select every skill in this section',
      'page.selected': 'selected',
      'page.batchEnable': 'Enable selected',
      'page.batchDisable': 'Disable selected',
      'page.batchMove': 'Move to group…',
      'page.batchUngroup': 'Remove from group',
      'page.batchClear': 'Clear selection',
      'page.collapse': 'Collapse',
      'page.expand': 'Expand',
      'page.collapseAll': 'Collapse all',
      'page.expandAll': 'Expand all',
      'page.rename': 'Rename',
      'page.renameSave': 'Save',
      'page.renameCancel': 'Cancel',
      'page.renamePlaceholder': 'Group name',
      'page.dragHint': 'Drag to reorder',
      'page.applied': 'Applied to',
      'page.skipped': 'skipped',
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
      renameInput: {
        height: 24,
        width: 180,
        boxSizing: 'border-box',
        padding: '0 8px',
        borderRadius: 6,
        border: '1px solid var(--dsw-alias-brand-primary)',
        background: 'var(--dsw-alias-bg-layer-1)',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: 13,
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
      note: {
        marginTop: 14,
        padding: '8px 12px',
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-state-success-primary)',
        color: 'var(--dsw-alias-state-success-primary)',
        fontSize: 12,
        lineHeight: '18px',
      },
      batchBar: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        padding: '10px 12px',
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-brand-primary)',
        background: 'var(--dsw-alias-bg-layer-1)',
      },
      batchCount: { fontSize: 12, fontWeight: 600, color: 'var(--dsw-alias-brand-primary)' },
      section: { marginTop: 22 },
      sectionHead: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 2px 8px',
        borderRadius: 8,
      },
      sectionHeadDrop: {
        boxShadow: 'inset 0 2px 0 0 var(--dsw-alias-brand-primary)',
      },
      sectionTitle: { fontSize: 13, fontWeight: 600, color: 'var(--dsw-alias-label-primary)' },
      sectionCount: { fontSize: 12, color: 'var(--dsw-alias-label-secondary)' },
      sectionHint: {
        fontSize: 11,
        lineHeight: '16px',
        color: 'var(--dsw-alias-label-secondary)',
        textAlign: 'right',
        flex: '0 1 auto',
      },
      chevron: {
        width: 18,
        height: 18,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        background: 'transparent',
        color: 'var(--dsw-alias-label-secondary)',
        cursor: 'pointer',
        padding: 0,
        fontSize: 10,
        flex: '0 0 auto',
      },
      handle: {
        cursor: 'grab',
        color: 'var(--dsw-alias-label-secondary)',
        fontSize: 12,
        lineHeight: '16px',
        userSelect: 'none',
        padding: '0 2px',
        flex: '0 0 auto',
      },
      checkbox: {
        width: 14,
        height: 14,
        margin: 0,
        accentColor: 'var(--dsw-alias-brand-primary)',
        cursor: 'pointer',
        flex: '0 0 auto',
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

    function readCollapsed() {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(COLLAPSE_KEY) ?? '[]')
        if (!Array.isArray(parsed)) return new Set()
        return new Set(parsed.filter((entry) => typeof entry === 'string'))
      } catch {
        return new Set()
      }
    }

    function writeCollapsed(collapsed) {
      try {
        window.localStorage.setItem(COLLAPSE_KEY, JSON.stringify([...collapsed]))
      } catch {
        // Blocked storage must never break the panel.
      }
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
      const ui = props.ui
      const skill = props.skill
      const busy = ui.pending !== ''
      const title = [h('span', { key: 'name', style: S.skillName }, skill.name)]
      if (typeof skill.source === 'string' && skill.source !== '') {
        title.push(h(Badge, { key: 'source' }, skill.source))
      }
      if (skill.available === false) {
        title.push(h(Badge, { key: 'missing', warn: true }, t('page.missing')))
      }
      const children = [
        h('input', {
          key: 'check',
          type: 'checkbox',
          checked: ui.selected.has(skill.name),
          disabled: busy,
          'aria-label': t('page.selectOne'),
          onChange: () => ui.onSelectSkill(skill.name),
          style: S.checkbox,
        }),
        h('div', { key: 'main', style: S.rowMain }, [
          h('div', { key: 'title', style: S.rowTitle }, title),
          typeof skill.description === 'string' && skill.description !== ''
            ? h('div', { key: 'description', style: S.description }, skill.description)
            : null,
        ]),
        h('select', {
          key: 'group',
          value: typeof skill.groupId === 'string' ? skill.groupId : '',
          disabled: busy || ui.groups.length === 0,
          onChange: (event) => ui.onAssignSkill(skill.name, event.target.value),
          style: S.select,
          title: t('page.groupPicker'),
          'aria-label': t('page.groupPicker'),
        }, [h('option', { key: '', value: '' }, t('page.ungrouped'))].concat(
          ui.groups.map((group) => h('option', { key: group.id, value: group.id }, group.name)),
        )),
        h(Toggle, {
          key: 'toggle',
          t,
          on: skill.enabled,
          disabled: busy,
          onClick: () => ui.onToggleSkill(skill),
        }),
      ]
      return h('div', { style: props.first === true ? S.row : Object.assign({}, S.row, S.rowDivider) }, children)
    }

    function GroupSection(props) {
      const t = props.t
      const ui = props.ui
      const group = props.group
      const skills = props.skills
      const sectionKey = group === null ? 'ungrouped' : group.id
      const collapsed = ui.collapsed.has(sectionKey)
      const renaming = group !== null && ui.renaming !== null && ui.renaming.id === group.id
      const confirming = group !== null && ui.confirming === group.id
      const dropTarget = group !== null && ui.dragOver === group.id
      const dragging = group !== null && ui.dragId === group.id
      const allSelected = skills.length > 0 && skills.every((skill) => ui.selected.has(skill.name))

      const head = []
      if (group !== null) {
        head.push(h('span', {
          key: 'handle',
          draggable: true,
          title: t('page.dragHint'),
          'aria-label': t('page.dragHint'),
          onDragStart: (event) => {
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('text/plain', group.id)
            ui.onDragStart(group.id)
          },
          onDragEnd: () => ui.onDragEnd(),
          style: S.handle,
        }, '⠿'))
      }
      head.push(h('button', {
        key: 'chevron',
        type: 'button',
        'aria-expanded': collapsed ? 'false' : 'true',
        'aria-label': collapsed ? t('page.expand') : t('page.collapse'),
        title: collapsed ? t('page.expand') : t('page.collapse'),
        onClick: () => ui.onToggleCollapse(sectionKey),
        style: S.chevron,
      }, collapsed ? '▸' : '▾'))
      head.push(h('input', {
        key: 'selectSect',
        type: 'checkbox',
        checked: allSelected,
        disabled: skills.length === 0 || ui.pending !== '',
        'aria-label': t('page.selectSection'),
        onChange: () => ui.onSelectSection(sectionKey),
        style: S.checkbox,
      }))

      if (renaming) {
        head.push(h('input', {
          key: 'rename',
          value: ui.renaming.draft,
          autoFocus: true,
          maxLength: 40,
          placeholder: t('page.renamePlaceholder'),
          'aria-label': t('page.renamePlaceholder'),
          onChange: (event) => ui.onRenameDraft(event.target.value),
          onKeyDown: (event) => {
            if (event.key === 'Enter') ui.onSaveRename()
            else if (event.key === 'Escape') ui.onCancelRename()
          },
          style: S.renameInput,
        }))
        head.push(h('button', {
          key: 'renameSave',
          type: 'button',
          style: S.buttonQuiet,
          onClick: () => ui.onSaveRename(),
        }, t('page.renameSave')))
        head.push(h('button', {
          key: 'renameCancel',
          type: 'button',
          style: S.buttonQuiet,
          onClick: () => ui.onCancelRename(),
        }, t('page.renameCancel')))
      } else {
        head.push(h('span', { key: 'title', style: S.sectionTitle }, group === null ? t('page.ungrouped') : group.name))
        head.push(h('span', { key: 'count', style: S.sectionCount }, String(skills.length)))
        head.push(h('span', { key: 'spacer', style: { flex: '1 1 auto' } }))
        if (group !== null) {
          if (confirming) {
            head.push(h('span', { key: 'hint', style: S.sectionHint }, t('page.deleteHint')))
            head.push(h('button', {
              key: 'cancelDelete',
              type: 'button',
              style: S.buttonQuiet,
              onClick: () => ui.onCancelDelete(),
            }, t('page.cancel')))
          }
          head.push(h('button', {
            key: 'renameBtn',
            type: 'button',
            style: S.buttonQuiet,
            title: t('page.rename'),
            onClick: () => ui.onStartRename(group),
          }, t('page.rename')))
          head.push(h('button', {
            key: 'delete',
            type: 'button',
            style: S.buttonQuiet,
            title: t('page.deleteHint'),
            onClick: () => ui.onDeleteGroup(group, confirming),
          }, confirming ? t('page.confirmDeleteGroup') : t('page.deleteGroup')))
        }
      }

      const body = collapsed
        ? []
        : [skills.length === 0
          ? h('div', { key: 'empty', style: S.emptyRow }, t('page.emptyGroup'))
          : skills.map((skill, index) => h(SkillRow, {
            key: skill.name,
            t,
            ui,
            skill,
            first: index === 0,
          }))]

      const headStyle = dropTarget ? Object.assign({}, S.sectionHead, S.sectionHeadDrop) : S.sectionHead
      return h('section', {
        style: Object.assign({}, S.section, dragging ? { opacity: 0.55 } : {}),
        onDragOver: group !== null
          ? (event) => {
            if (ui.dragId === null) return
            event.preventDefault()
            event.dataTransfer.dropEffect = 'move'
            ui.onDragOver(group.id)
          }
          : undefined,
        onDragLeave: group !== null
          ? (event) => {
            if (event.currentTarget.contains(event.relatedTarget)) return
            ui.onDragOver(null)
          }
          : undefined,
        onDrop: group !== null
          ? (event) => {
            event.preventDefault()
            ui.onDrop(group.id)
          }
          : undefined,
      }, [
        h('div', { key: 'head', style: headStyle }, head),
        collapsed ? null : h('div', { key: 'body', style: S.card }, body),
      ])
    }

    function createPage(t) {
      return function SkillManagerPage() {
        const [data, setData] = React.useState(null)
        const [status, setStatus] = React.useState('loading')
        const [error, setError] = React.useState('')
        const [note, setNote] = React.useState('')
        const [pending, setPending] = React.useState('')
        const [draftGroup, setDraftGroup] = React.useState('')
        const [confirmGroup, setConfirmGroup] = React.useState('')
        const [renaming, setRenaming] = React.useState(null)
        const [collapsed, setCollapsed] = React.useState(() => readCollapsed())
        const [selected, setSelected] = React.useState(() => new Set())
        const [dragId, setDragId] = React.useState(null)
        const [dragOver, setDragOver] = React.useState(null)
        const alive = React.useRef(true)
        const dragging = React.useRef(null)

        React.useEffect(() => () => {
          alive.current = false
        }, [])

        React.useEffect(() => {
          writeCollapsed(collapsed)
        }, [collapsed])

        React.useEffect(() => {
          if (note === '') return undefined
          const timer = setTimeout(() => setNote(''), 4000)
          return () => clearTimeout(timer)
        }, [note])

        const fail = React.useCallback((failure) => {
          const network = failure !== null && typeof failure === 'object' && failure.network === true
          setError(network ? `${t('page.errorFetch')} ${t('page.hintFetch')}` : messageOf(failure))
        }, [])

        const pruneSelection = React.useCallback((payload) => {
          const names = new Set((payload.skills ?? []).map((skill) => skill.name))
          setSelected((previous) => {
            let dropped = false
            const next = new Set()
            for (const name of previous) {
              if (names.has(name)) next.add(name)
              else dropped = true
            }
            return dropped ? next : previous
          })
        }, [])

        const load = React.useCallback(async () => {
          setStatus((current) => (current === 'ready' ? current : 'loading'))
          setError('')
          try {
            const payload = await request(STATE_URL)
            if (!alive.current) return
            setData(payload)
            setStatus('ready')
            pruneSelection(payload)
          } catch (failure) {
            if (!alive.current) return
            fail(failure)
            setStatus('error')
          }
        }, [fail, pruneSelection])

        React.useEffect(() => {
          load()
        }, [load])

        const act = React.useCallback(async (payload, token) => {
          setPending(token)
          setError('')
          try {
            const next = await request(ACTION_URL, payload)
            if (!alive.current) return null
            setData(next)
            setStatus('ready')
            pruneSelection(next)
            const result = next.result
            if (result !== null && typeof result === 'object' && Array.isArray(result.applied)) {
              const skipped = Array.isArray(result.skipped) ? result.skipped.length : 0
              setNote(
                `${t('page.applied')} ${result.applied.length}` +
                  (skipped > 0 ? ` · ${t('page.skipped')} ${skipped}` : ''),
              )
            }
            return next
          } catch (failure) {
            if (alive.current) fail(failure)
            return null
          } finally {
            if (alive.current) setPending('')
          }
        }, [fail, pruneSelection])

        const onToggleSkill = React.useCallback((skill) => {
          act({ action: skill.enabled ? 'disable' : 'enable', name: skill.name }, `toggle:${skill.name}`)
        }, [act])

        const onAssignSkill = React.useCallback((name, groupId) => {
          act(
            groupId === ''
              ? { action: 'assign', name, group: '', group_id: '' }
              : { action: 'assign', name, group_id: groupId },
            `assign:${name}`,
          )
        }, [act])

        const onSelectSkill = React.useCallback((name) => {
          setSelected((previous) => {
            const next = new Set(previous)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
          })
        }, [])

        const groups = data !== null && Array.isArray(data.groups) ? data.groups : []
        const skills = data !== null && Array.isArray(data.skills) ? data.skills : []
        const stats = data !== null && data.stats !== null && typeof data.stats === 'object' ? data.stats : null

        const byGroup = new Map()
        for (const group of groups) byGroup.set(group.id, [])
        const ungrouped = []
        for (const skill of skills) {
          if (typeof skill.groupId === 'string' && byGroup.has(skill.groupId)) byGroup.get(skill.groupId).push(skill)
          else ungrouped.push(skill)
        }

        const onSelectSection = (sectionKey) => {
          const inSection = skills.filter((skill) => (
            sectionKey === 'ungrouped'
              ? !(typeof skill.groupId === 'string' && byGroup.has(skill.groupId))
              : skill.groupId === sectionKey
          ))
          setSelected((previous) => {
            const next = new Set(previous)
            const all = inSection.length > 0 && inSection.every((skill) => next.has(skill.name))
            for (const skill of inSection) {
              if (all) next.delete(skill.name)
              else next.add(skill.name)
            }
            return next
          })
        }

        const runBatch = React.useCallback(async (op, extra) => {
          const names = [...selected]
          if (names.length === 0) return
          const next = await act(Object.assign({ action: 'batch', op, names }, extra ?? {}), 'batch')
          if (next !== null && alive.current) setSelected(new Set())
        }, [act, selected])

        const onBatchMove = (groupId) => {
          if (groupId === '') return
          runBatch('assign', { group_id: groupId })
        }

        const onCreateGroup = React.useCallback(async () => {
          const name = draftGroup.trim()
          if (name === '') return
          const next = await act({ action: 'create_group', group: name }, 'group:create')
          if (next !== null && alive.current) setDraftGroup('')
        }, [act, draftGroup])

        const onDeleteGroup = React.useCallback(async (group, confirming) => {
          if (!confirming) {
            setConfirmGroup(group.id)
            return
          }
          setConfirmGroup('')
          const next = await act({ action: 'delete_group', group_id: group.id }, `group:delete:${group.id}`)
          if (next !== null && alive.current) {
            setCollapsed((previous) => {
              if (!previous.has(group.id)) return previous
              const copy = new Set(previous)
              copy.delete(group.id)
              return copy
            })
          }
        }, [act])

        const onStartRename = (group) => setRenaming({ id: group.id, draft: group.name })

        const onRenameDraft = (draft) => {
          setRenaming((current) => (current === null ? current : { id: current.id, draft }))
        }

        const onCancelRename = () => setRenaming(null)

        const onSaveRename = React.useCallback(async () => {
          if (renaming === null) return
          const name = renaming.draft.trim()
          if (name === '') return
          const next = await act({ action: 'rename_group', group_id: renaming.id, to: name }, 'group:rename')
          if (next !== null && alive.current) setRenaming(null)
        }, [act, renaming])

        const onToggleCollapse = React.useCallback((sectionKey) => {
          setCollapsed((previous) => {
            const next = new Set(previous)
            if (next.has(sectionKey)) next.delete(sectionKey)
            else next.add(sectionKey)
            return next
          })
        }, [])

        const onDragStart = (groupId) => {
          dragging.current = groupId
          setDragId(groupId)
          setDragOver(null)
        }

        const onDragOver = (groupId) => setDragOver(groupId)

        const onDragEnd = React.useCallback(() => {
          dragging.current = null
          setDragId(null)
          setDragOver(null)
        }, [])

        const onDrop = (targetId) => {
          const source = dragging.current
          onDragEnd()
          if (source === null || source === targetId) return
          const ids = groups.map((group) => group.id)
          const from = ids.indexOf(source)
          const to = ids.indexOf(targetId)
          if (from < 0 || to < 0) return
          const ordered = ids.slice()
          ordered.splice(from, 1)
          ordered.splice(to, 0, source)
          act({ action: 'reorder_groups', ids: ordered }, 'group:reorder')
        }

        const ui = {
          t,
          pending,
          groups,
          selected,
          confirming: confirmGroup,
          renaming,
          collapsed,
          dragId,
          dragOver,
          onToggleSkill,
          onAssignSkill,
          onSelectSkill,
          onSelectSection,
          onToggleCollapse,
          onStartRename,
          onRenameDraft,
          onSaveRename,
          onCancelRename,
          onDeleteGroup,
          onCancelDelete: () => setConfirmGroup(''),
          onDragStart,
          onDragOver,
          onDragEnd,
          onDrop,
        }

        const sections = []
        if (ungrouped.length > 0) {
          sections.push(h(GroupSection, { key: 'ungrouped', t, ui, group: null, skills: ungrouped }))
        }
        for (const group of groups) {
          sections.push(h(GroupSection, {
            key: group.id,
            t,
            ui,
            group,
            skills: byGroup.get(group.id) ?? [],
          }))
        }

        const allCollapsed = groups.length > 0 && groups.every((group) => collapsed.has(group.id)) &&
          (ungrouped.length === 0 || collapsed.has('ungrouped'))

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
            style: Object.assign({}, S.button, { opacity: status === 'loading' || pending !== '' ? 0.6 : 1 }),
            disabled: status === 'loading' || pending !== '',
            onClick: () => load(),
          }, t('page.refresh')),
        ])

        const notices = []
        if (error !== '') notices.push(h('div', { key: 'error', style: S.banner }, error))
        if (note !== '') notices.push(h('div', { key: 'note', style: S.note }, note))
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
          h('span', { key: 'spacer', style: { flex: '1 1 auto' } }),
          h('button', {
            key: 'collapseAll',
            type: 'button',
            style: S.button,
            disabled: groups.length === 0 && ungrouped.length === 0,
            onClick: () => {
              if (allCollapsed) {
                setCollapsed(new Set())
                return
              }
              const next = new Set()
              for (const group of groups) next.add(group.id)
              if (ungrouped.length > 0) next.add('ungrouped')
              setCollapsed(next)
            },
          }, allCollapsed ? t('page.expandAll') : t('page.collapseAll')),
        ])

        const batchBar = selected.size === 0 ? null : h('div', { style: S.batchBar }, [
          h('span', { key: 'count', style: S.batchCount }, `${t('page.selected')} ${selected.size}`),
          h('button', {
            key: 'enable',
            type: 'button',
            style: S.button,
            disabled: pending !== '',
            onClick: () => runBatch('enable'),
          }, t('page.batchEnable')),
          h('button', {
            key: 'disable',
            type: 'button',
            style: S.button,
            disabled: pending !== '',
            onClick: () => runBatch('disable'),
          }, t('page.batchDisable')),
          h('select', {
            key: 'move',
            value: '',
            disabled: pending !== '' || groups.length === 0,
            'aria-label': t('page.batchMove'),
            title: t('page.batchMove'),
            style: S.select,
            onChange: (event) => onBatchMove(event.target.value),
          }, [h('option', { key: '', value: '' }, t('page.batchMove'))].concat(
            groups.map((group) => h('option', { key: group.id, value: group.id }, group.name)),
          )),
          h('button', {
            key: 'ungroup',
            type: 'button',
            style: S.button,
            disabled: pending !== '',
            onClick: () => runBatch('ungroup'),
          }, t('page.batchUngroup')),
          h('span', { key: 'spacer', style: { flex: '1 1 auto' } }),
          h('button', {
            key: 'clear',
            type: 'button',
            style: S.buttonQuiet,
            onClick: () => setSelected(new Set()),
          }, t('page.batchClear')),
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

        const top = [header, toolbar]
        if (batchBar !== null) top.push(batchBar)
        return h('div', { style: S.page }, h('div', { style: S.inner }, top.concat(notices, body, [footer])))
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
