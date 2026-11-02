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

    /**
     * Visual direction: a registry index, not a card gallery.
     *
     * Harness skills are an inventory — names, providers, an on/off policy and a
     * user-controlled order. So the page borrows the structure of a printed
     * index: a fixed order column, hairline table rules, annotations set in
     * secondary type, and exactly one colour signal per row (the status dot).
     * No cards, no shadows, no pills; radius is reserved for controls.
     */

    const ZH = {
      'nav.title': 'SKILL 管理',
      'page.title': 'SKILL 管理',
      'page.subtitle': '分组只决定这里的排列，开关才决定是否被索引。',
      'page.refresh': '刷新',
      'page.loading': '正在读取技能…',
      'page.empty': '还没有发现任何技能。',
      'page.emptyGroup': '暂无技能',
      'page.ungrouped': '未分组',
      'page.newGroup': '新分组名称',
      'page.addGroup': '新建分组',
      'page.filterAll': '全部',
      'page.filterOn': '已启用',
      'page.filterOff': '已关闭',
      'page.searchPlaceholder': '搜索名称、描述或来源',
      'page.clearFilters': '清除筛选',
      'page.noMatch': '没有匹配的技能。',
      'page.on': '已启用',
      'page.off': '已关闭',
      'page.missing': '来源已不存在',
      'page.selectOne': '选择此技能',
      'page.selectSection': '选择本节全部技能',
      'page.selected': '已选',
      'page.batchMode': '批量管理',
      'page.done': '完成',
      'page.selectAll': '全选',
      'page.invert': '反选',
      'page.batchClear': '清空',
      'page.batchEnable': '启用',
      'page.batchDisable': '关闭',
      'page.batchMove': '移到分组…',
      'page.batchUngroup': '移出分组',
      'page.collapse': '折叠',
      'page.expand': '展开',
      'page.collapseAll': '全部折叠',
      'page.expandAll': '全部展开',
      'page.actions': '更多操作',
      'page.moveUp': '上移',
      'page.moveDown': '下移',
      'page.moveTop': '置顶',
      'page.moveBottom': '置底',
      'page.rename': '重命名',
      'page.renameSave': '保存',
      'page.renameCancel': '取消',
      'page.renamePlaceholder': '分组名称',
      'page.deleteGroup': '删除分组',
      'page.confirmDeleteGroup': '确认删除',
      'page.deleteHint': '只删除这个分组，组内技能回到「未分组」；技能、启用状态和文件都不会改变。',
      'page.groupPicker': '移动到分组',
      'page.cancel': '取消',
      'page.note': '{applied} 项已应用，{skipped} 项跳过',
      'page.noteClean': '{applied} 项已应用',
      'page.footer': '分组只影响这里的排列；开关不修改技能文件。',
      'page.errorFetch': '连不上宿主服务。',
      'page.hintFetch': '请通过 Web 界面的 http 地址打开本页并刷新；仍然失败就查看 Harness 日志。',
      'page.retry': '重试',
      'page.incomplete': '目录扫描不完整，这份列表可能有遗漏。',
      'page.noAgent': '当前没有活动会话，技能来源可能列不全。',
      'page.savedTo': '状态文件',
    }

    const EN = {
      'nav.title': 'SKILL Manager',
      'page.title': 'SKILL Manager',
      'page.subtitle': 'Groups only change the order here; the switch decides what stays indexed.',
      'page.refresh': 'Refresh',
      'page.loading': 'Reading skills…',
      'page.empty': 'No skills discovered yet.',
      'page.emptyGroup': 'No skills',
      'page.ungrouped': 'Ungrouped',
      'page.newGroup': 'New group name',
      'page.addGroup': 'Create group',
      'page.filterAll': 'All',
      'page.filterOn': 'Enabled',
      'page.filterOff': 'Off',
      'page.searchPlaceholder': 'Search name, description, or source',
      'page.clearFilters': 'Clear filters',
      'page.noMatch': 'No skills match those filters.',
      'page.on': 'On',
      'page.off': 'Off',
      'page.missing': 'source missing',
      'page.selectOne': 'Select this skill',
      'page.selectSection': 'Select every skill in this section',
      'page.selected': 'Selected',
      'page.batchMode': 'Batch actions',
      'page.done': 'Done',
      'page.selectAll': 'Select all',
      'page.invert': 'Invert',
      'page.batchClear': 'Clear',
      'page.batchEnable': 'Enable',
      'page.batchDisable': 'Disable',
      'page.batchMove': 'Move to group…',
      'page.batchUngroup': 'Remove from group',
      'page.collapse': 'Collapse',
      'page.expand': 'Expand',
      'page.collapseAll': 'Collapse all',
      'page.expandAll': 'Expand all',
      'page.actions': 'More actions',
      'page.moveUp': 'Move up',
      'page.moveDown': 'Move down',
      'page.moveTop': 'Move to top',
      'page.moveBottom': 'Move to bottom',
      'page.rename': 'Rename',
      'page.renameSave': 'Save',
      'page.renameCancel': 'Cancel',
      'page.renamePlaceholder': 'Group name',
      'page.deleteGroup': 'Delete group',
      'page.confirmDeleteGroup': 'Delete',
      'page.deleteHint': 'Only this group goes away; its skills return to Ungrouped. Skills, their on/off state, and their files stay untouched.',
      'page.groupPicker': 'Move to group',
      'page.cancel': 'Cancel',
      'page.note': '{applied} applied, {skipped} skipped',
      'page.noteClean': '{applied} applied',
      'page.footer': 'Groups only change the order here; the switch edits no skill file.',
      'page.errorFetch': 'Cannot reach the host service.',
      'page.hintFetch': 'Open this page through the Web GUI http address and reload; if it still fails, check the Harness log.',
      'page.retry': 'Retry',
      'page.incomplete': 'Discovery was incomplete, so this list may miss skills.',
      'page.noAgent': 'No live session right now, so sources may be incomplete.',
      'page.savedTo': 'State file',
    }

    const S = {
      page: {
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
        background: 'var(--dsw-alias-bg-base)',
        color: 'var(--dsw-alias-label-primary)',
        padding: '24px 28px 56px',
      },
      inner: { maxWidth: 880, margin: '0 auto' },
      masthead: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 },
      title: { margin: 0, fontSize: 18, fontWeight: 600, lineHeight: '24px', letterSpacing: '0.01em' },
      subtitle: {
        margin: '4px 0 0',
        fontSize: 12.5,
        lineHeight: '18px',
        color: 'var(--dsw-alias-label-secondary)',
        maxWidth: 520,
      },
      rule: { height: 1, background: 'var(--dsw-alias-border-l1)', marginTop: 14 },
      searchRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 14 },
      search: {
        flex: '1 1 220px',
        height: 30,
        minWidth: 160,
        maxWidth: 320,
        boxSizing: 'border-box',
        padding: '0 10px',
        borderRadius: 6,
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-layer-1)',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: 12,
        outline: 'none',
      },
      tabs: { display: 'inline-flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
      tab: {
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 5,
        height: 30,
        padding: '0 1px',
        border: 'none',
        borderBottom: '2px solid transparent',
        background: 'transparent',
        color: 'var(--dsw-alias-label-secondary)',
        font: 'inherit',
        fontSize: 12,
        cursor: 'pointer',
      },
      tabActive: {
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 5,
        height: 30,
        padding: '0 1px',
        border: 'none',
        borderBottom: '2px solid var(--dsw-alias-brand-primary)',
        background: 'transparent',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
      },
      tabCount: {
        fontSize: 11,
        color: 'var(--dsw-alias-label-secondary)',
        fontVariantNumeric: 'tabular-nums',
      },
      actions: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 12 },
      input: {
        height: 28,
        width: 180,
        boxSizing: 'border-box',
        padding: '0 9px',
        borderRadius: 6,
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-layer-1)',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: 12,
        outline: 'none',
      },
      textButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 28,
        padding: '0 6px',
        border: 'none',
        background: 'transparent',
        color: 'var(--dsw-alias-label-secondary)',
        font: 'inherit',
        fontSize: 12,
        cursor: 'pointer',
        flex: '0 0 auto',
      },
      primary: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 28,
        padding: '0 12px',
        borderRadius: 6,
        border: '1px solid var(--dsw-alias-brand-primary)',
        background: 'transparent',
        color: 'var(--dsw-alias-brand-primary)',
        font: 'inherit',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        flex: '0 0 auto',
        whiteSpace: 'nowrap',
      },
      secondary: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 28,
        padding: '0 10px',
        borderRadius: 6,
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'transparent',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: 12,
        cursor: 'pointer',
        flex: '0 0 auto',
        whiteSpace: 'nowrap',
      },
      quiet: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 24,
        padding: '0 8px',
        borderRadius: 5,
        border: '1px solid transparent',
        background: 'transparent',
        color: 'var(--dsw-alias-label-secondary)',
        font: 'inherit',
        fontSize: 11,
        cursor: 'pointer',
        flex: '0 0 auto',
        whiteSpace: 'nowrap',
      },
      quietDanger: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 24,
        padding: '0 8px',
        borderRadius: 5,
        border: '1px solid transparent',
        background: 'transparent',
        color: 'var(--dsw-alias-state-error-primary)',
        font: 'inherit',
        fontSize: 11,
        cursor: 'pointer',
        flex: '0 0 auto',
        whiteSpace: 'nowrap',
      },
      iconButton: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        padding: 0,
        borderRadius: 5,
        border: 'none',
        background: 'transparent',
        color: 'var(--dsw-alias-label-secondary)',
        font: 'inherit',
        fontSize: 11,
        lineHeight: '16px',
        cursor: 'pointer',
        flex: '0 0 auto',
      },
      selectionStrip: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 10,
        marginTop: 12,
        padding: '8px 0 10px',
        borderTop: '2px solid var(--dsw-alias-brand-primary)',
        borderBottom: '1px solid var(--dsw-alias-border-l1)',
      },
      selectionCount: {
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--dsw-alias-brand-primary)',
        fontVariantNumeric: 'tabular-nums',
        flex: '0 0 auto',
      },
      divider: { width: 1, height: 16, background: 'var(--dsw-alias-border-l1)', flex: '0 0 auto' },
      alerts: { marginTop: 12 },
      alert: {
        padding: '8px 10px',
        borderRadius: 6,
        border: '1px solid var(--dsw-alias-state-error-primary)',
        color: 'var(--dsw-alias-state-error-primary)',
        fontSize: 12,
        lineHeight: '18px',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        marginBottom: 6,
      },
      noteLine: {
        padding: '4px 0',
        fontSize: 12,
        lineHeight: '18px',
        color: 'var(--dsw-alias-label-secondary)',
      },
      section: { marginTop: 22 },
      sectionDivided: {
        marginTop: 24,
        paddingTop: 14,
        borderTop: '1px solid var(--dsw-alias-border-l2)',
      },
      groupHead: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 0',
        minHeight: 30,
        cursor: 'pointer',
      },
      order: {
        width: 24,
        textAlign: 'right',
        fontSize: 11,
        color: 'var(--dsw-alias-label-secondary)',
        fontVariantNumeric: 'tabular-nums',
        flex: '0 0 auto',
        marginRight: 2,
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
        fontSize: 9,
        flex: '0 0 auto',
      },
      groupName: { fontSize: 13, fontWeight: 600, color: 'var(--dsw-alias-label-primary)', flex: '0 0 auto' },
      groupCount: {
        fontSize: 11,
        color: 'var(--dsw-alias-label-secondary)',
        fontVariantNumeric: 'tabular-nums',
        flex: '0 0 auto',
      },
      spacer: { flex: '1 1 auto' },
      renameInput: {
        height: 24,
        width: 180,
        boxSizing: 'border-box',
        padding: '0 7px',
        borderRadius: 5,
        border: '1px solid var(--dsw-alias-brand-primary)',
        background: 'var(--dsw-alias-bg-base)',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: 13,
        outline: 'none',
      },
      menuWrap: { position: 'relative', display: 'inline-flex', flex: '0 0 auto' },
      menu: {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 2,
        zIndex: 30,
        minWidth: 132,
        padding: 4,
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-overlay)',
      },
      menuItem: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: 28,
        padding: '0 8px',
        border: 'none',
        background: 'transparent',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: 12,
        borderRadius: 4,
        cursor: 'pointer',
        textAlign: 'left',
        whiteSpace: 'nowrap',
      },
      menuItemDanger: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: 28,
        padding: '0 8px',
        border: 'none',
        background: 'transparent',
        color: 'var(--dsw-alias-state-error-primary)',
        font: 'inherit',
        fontSize: 12,
        borderRadius: 4,
        cursor: 'pointer',
        textAlign: 'left',
        whiteSpace: 'nowrap',
      },
      confirm: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        margin: '2px 0 8px',
        paddingLeft: 10,
        borderLeft: '2px solid var(--dsw-alias-state-warn-primary)',
        fontSize: 11,
        lineHeight: '16px',
        color: 'var(--dsw-alias-label-secondary)',
      },
      confirmText: { flex: '1 1 240px' },
      rows: {},
      row: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 0',
        borderTop: '1px solid var(--dsw-alias-border-l1)',
      },
      rowMain: { flex: '1 1 auto', minWidth: 0 },
      rowTitle: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        minWidth: 0,
        flexWrap: 'nowrap',
      },
      skillName: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        fontSize: 12.5,
        color: 'var(--dsw-alias-label-primary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: '0 1 auto',
      },
      source: {
        fontSize: 11,
        color: 'var(--dsw-alias-label-secondary)',
        whiteSpace: 'nowrap',
        flex: '0 0 auto',
      },
      sourceMissing: {
        fontSize: 11,
        color: 'var(--dsw-alias-state-warn-primary)',
        whiteSpace: 'nowrap',
        flex: '0 0 auto',
      },
      description: {
        marginTop: 2,
        fontSize: 12,
        lineHeight: '17px',
        color: 'var(--dsw-alias-label-secondary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      picker: {
        height: 22,
        maxWidth: 118,
        boxSizing: 'border-box',
        padding: '0 4px',
        borderRadius: 4,
        border: '1px solid transparent',
        background: 'transparent',
        color: 'var(--dsw-alias-label-secondary)',
        font: 'inherit',
        fontSize: 11,
        cursor: 'pointer',
        flex: '0 0 auto',
      },
      status: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 24,
        padding: '0 4px',
        border: 'none',
        background: 'transparent',
        color: 'var(--dsw-alias-label-secondary)',
        font: 'inherit',
        fontSize: 11.5,
        cursor: 'pointer',
        flex: '0 0 auto',
        whiteSpace: 'nowrap',
      },
      statusDot: { width: 6, height: 6, borderRadius: 3, flex: '0 0 auto' },
      emptyRow: { padding: '8px 0', fontSize: 11.5, color: 'var(--dsw-alias-label-secondary)', borderTop: '1px solid var(--dsw-alias-border-l1)' },
      emptyState: { marginTop: 28, fontSize: 12.5, color: 'var(--dsw-alias-label-secondary)' },
      emptyAction: { marginTop: 10 },
      footer: {
        marginTop: 28,
        paddingTop: 12,
        borderTop: '1px solid var(--dsw-alias-border-l1)',
        fontSize: 11,
        lineHeight: '17px',
        color: 'var(--dsw-alias-label-secondary)',
        overflowWrap: 'anywhere',
      },
      checkbox: {
        width: 14,
        height: 14,
        margin: 0,
        accentColor: 'var(--dsw-alias-brand-primary)',
        cursor: 'pointer',
        flex: '0 0 auto',
      },
    }

    // Component-local behaviour that inline styles cannot express: hover bands,
    // a visible keyboard focus ring, and a reduced-motion opt-out.
    const STYLE_TEXT = [
      '.sm-panel .sm-row:hover { background: var(--dsw-alias-bg-layer-1); }',
      '.sm-panel .sm-row { transition: background 120ms ease; }',
      '.sm-panel .sm-quiet:hover:not(:disabled) { color: var(--dsw-alias-label-primary); }',
      '.sm-panel .sm-picker:hover, .sm-panel .sm-picker:focus-visible { border-color: var(--dsw-alias-border-l1); }',
      '.sm-panel .sm-menu-item:hover:not(:disabled) { background: var(--dsw-alias-bg-layer-2); }',
      '.sm-panel button:focus-visible, .sm-panel input:focus-visible, .sm-panel select:focus-visible {',
      '  outline: 2px solid var(--dsw-alias-brand-primary);',
      '  outline-offset: 1px;',
      '}',
      '.sm-panel button:disabled { opacity: 0.4; cursor: default; }',
      '@media (prefers-reduced-motion: reduce) {',
      '  .sm-panel .sm-row { transition: none; }',
      '}',
    ].join('\n')

    function messageOf(failure) {
      if (failure !== null && typeof failure === 'object') {
        const text = failure.message
        if (typeof text === 'string' && text !== '') return text
      }
      return String(failure)
    }

    function fill(template, values) {
      return template.replace(/\{(\w+)\}/g, (match, key) => (
        values[key] === undefined ? match : String(values[key])
      ))
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

    function Tab(props) {
      return h('button', {
        type: 'button',
        'aria-pressed': props.active === true ? 'true' : 'false',
        onClick: props.onClick,
        style: props.active === true ? S.tabActive : S.tab,
      }, props.label, h('span', { style: S.tabCount }, String(props.count)))
    }

    function StatusToggle(props) {
      const t = props.t
      const on = props.on === true
      return h('button', {
        type: 'button',
        role: 'switch',
        className: 'sm-quiet',
        'aria-checked': on ? 'true' : 'false',
        'aria-label': on ? t('page.on') : t('page.off'),
        title: on ? t('page.on') : t('page.off'),
        disabled: props.disabled === true,
        onClick: props.onClick,
        style: S.status,
      }, [
        h('span', {
          key: 'dot',
          'aria-hidden': true,
          style: Object.assign({}, S.statusDot, {
            background: on
              ? 'var(--dsw-alias-state-success-primary)'
              : 'var(--dsw-alias-state-idle-primary)',
          }),
        }),
        on ? t('page.on') : t('page.off'),
      ])
    }

    function SkillRow(props) {
      const t = props.t
      const ui = props.ui
      const skill = props.skill
      const busy = ui.pending !== ''
      const selected = ui.selected.has(skill.name)
      const title = [h('span', { key: 'name', style: S.skillName }, skill.name)]
      if (typeof skill.source === 'string' && skill.source !== '') {
        title.push(h('span', { key: 'source', style: S.source }, skill.source))
      }
      if (skill.available === false) {
        title.push(h('span', { key: 'missing', style: S.sourceMissing }, t('page.missing')))
      }
      const children = []
      if (ui.selectionMode) {
        children.push(h('input', {
          key: 'check',
          type: 'checkbox',
          checked: selected,
          disabled: busy,
          'aria-label': t('page.selectOne'),
          onChange: () => ui.onSelectSkill(skill.name),
          style: S.checkbox,
        }))
      }
      children.push(h('div', {
        key: 'main',
        style: ui.selectionMode ? Object.assign({}, S.rowMain, { cursor: 'pointer' }) : S.rowMain,
        onClick: ui.selectionMode ? () => ui.onSelectSkill(skill.name) : undefined,
      }, [
        h('div', { key: 'title', style: S.rowTitle }, title),
        typeof skill.description === 'string' && skill.description !== ''
          ? h('div', { key: 'description', style: S.description, title: skill.description }, skill.description)
          : null,
      ]))
      children.push(
        h('select', {
          key: 'group',
          className: 'sm-picker',
          value: typeof skill.groupId === 'string' ? skill.groupId : '',
          disabled: busy || ui.groups.length === 0,
          onChange: (event) => ui.onAssignSkill(skill.name, event.target.value),
          style: S.picker,
          title: t('page.groupPicker'),
          'aria-label': t('page.groupPicker'),
        }, [h('option', { key: '', value: '' }, t('page.ungrouped'))].concat(
          ui.groups.map((group) => h('option', { key: group.id, value: group.id }, group.name)),
        )),
        h(StatusToggle, {
          key: 'status',
          t,
          on: skill.enabled,
          disabled: busy,
          onClick: () => ui.onToggleSkill(skill),
        }),
      )
      return h('div', { className: 'sm-row', style: S.row }, children)
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
      const menuOpen = group !== null && ui.menuGroupId === group.id
      const allSelected = skills.length > 0 && skills.every((skill) => ui.selected.has(skill.name))
      const isFirst = group !== null && props.index === 0
      const isLast = group !== null && props.index === props.groupCount - 1

      const head = [
        h('span', { key: 'order', style: S.order }, group === null ? '–' : String(props.index + 1)),
      ]
      if (ui.selectionMode) {
        head.push(h('input', {
          key: 'selectSect',
          type: 'checkbox',
          checked: allSelected,
          disabled: skills.length === 0 || ui.pending !== '',
          'aria-label': t('page.selectSection'),
          onChange: () => ui.onSelectSection(sectionKey),
          style: S.checkbox,
        }))
      }
      head.push(h('button', {
        key: 'chevron',
        type: 'button',
        'aria-expanded': collapsed ? 'false' : 'true',
        'aria-label': collapsed ? t('page.expand') : t('page.collapse'),
        title: collapsed ? t('page.expand') : t('page.collapse'),
        onClick: (event) => {
          event.stopPropagation()
          ui.onToggleCollapse(sectionKey)
        },
        style: S.chevron,
      }, collapsed ? '▸' : '▾'))

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
          style: S.quiet,
          onClick: () => ui.onSaveRename(),
        }, t('page.renameSave')))
        head.push(h('button', {
          key: 'renameCancel',
          type: 'button',
          style: S.quiet,
          onClick: () => ui.onCancelRename(),
        }, t('page.renameCancel')))
      } else {
        head.push(h('span', { key: 'name', style: S.groupName }, group === null ? t('page.ungrouped') : group.name))
        head.push(h('span', { key: 'count', style: S.groupCount }, props.countLabel))
        head.push(h('span', { key: 'spacer', style: S.spacer }))
        if (group !== null && !ui.selectionMode) {
          head.push(h('button', {
            key: 'up',
            type: 'button',
            className: 'sm-quiet',
            style: S.iconButton,
            title: t('page.moveUp'),
            'aria-label': t('page.moveUp'),
            disabled: ui.pending !== '' || isFirst,
            onClick: (event) => {
              event.stopPropagation()
              ui.onMoveGroup(group.id, -1)
            },
          }, '↑'))
          head.push(h('button', {
            key: 'down',
            type: 'button',
            className: 'sm-quiet',
            style: S.iconButton,
            title: t('page.moveDown'),
            'aria-label': t('page.moveDown'),
            disabled: ui.pending !== '' || isLast,
            onClick: (event) => {
              event.stopPropagation()
              ui.onMoveGroup(group.id, 1)
            },
          }, '↓'))
          head.push(menuNode(t, ui, group, menuOpen, isFirst, isLast))
        }
      }

      const body = collapsed
        ? []
        : [skills.length === 0
          ? h('div', { key: 'empty', style: S.emptyRow }, t('page.emptyGroup'))
          : skills.map((skill) => h(SkillRow, { key: skill.name, t, ui, skill }))]

      const confirmStrip = confirming
        ? h('div', { key: 'confirm', style: S.confirm }, [
          h('span', { key: 'hint', style: S.confirmText }, t('page.deleteHint')),
          h('button', {
            key: 'cancel',
            type: 'button',
            style: S.quiet,
            onClick: () => ui.onCancelDelete(),
          }, t('page.cancel')),
          h('button', {
            key: 'ok',
            type: 'button',
            style: S.quietDanger,
            onClick: () => ui.onDeleteGroup(group, true),
          }, t('page.confirmDeleteGroup')),
        ])
        : null

      return h('section', { style: props.first === true ? S.section : S.sectionDivided }, [
        h('div', {
          key: 'head',
          style: S.groupHead,
          onClick: (event) => {
            if (event.target !== null && event.target.closest !== undefined
              && event.target.closest('button,input,select,label')) return
            ui.onToggleCollapse(sectionKey)
          },
        }, head),
        confirmStrip,
        collapsed ? null : h('div', { key: 'body', style: S.rows }, body),
      ])
    }

    /**
     * Group actions sit behind one overflow control so the header stays a
     * single quiet row: order, name, count, then the move controls.
     */
    function menuNode(t, ui, group, open, isFirst, isLast) {
      const items = [
        { key: 'up', label: t('page.moveUp'), disabled: isFirst, run: () => ui.onMoveGroup(group.id, -1) },
        { key: 'down', label: t('page.moveDown'), disabled: isLast, run: () => ui.onMoveGroup(group.id, 1) },
        { key: 'top', label: t('page.moveTop'), disabled: isFirst, run: () => ui.onMoveTop(group.id) },
        { key: 'bottom', label: t('page.moveBottom'), disabled: isLast, run: () => ui.onMoveBottom(group.id) },
        { key: 'rename', label: t('page.rename'), run: () => ui.onStartRename(group) },
      ]
      const children = items.map((item) => h('button', {
        key: item.key,
        type: 'button',
        className: 'sm-menu-item',
        role: 'menuitem',
        disabled: item.disabled === true,
        style: S.menuItem,
        onClick: (event) => {
          event.stopPropagation()
          ui.onCloseMenu()
          item.run()
        },
      }, item.label))
      children.push(h('button', {
        key: 'delete',
        type: 'button',
        className: 'sm-menu-item',
        role: 'menuitem',
        style: S.menuItemDanger,
        onClick: (event) => {
          event.stopPropagation()
          ui.onCloseMenu()
          ui.onDeleteGroup(group, false)
        },
      }, t('page.deleteGroup')))

      return h('div', { key: 'menuWrap', style: S.menuWrap }, [
        h('button', {
          key: 'trigger',
          type: 'button',
          className: 'sm-menu-trigger sm-quiet',
          style: Object.assign({}, S.iconButton, { fontSize: 13, width: 24 }),
          title: t('page.actions'),
          'aria-label': t('page.actions'),
          'aria-haspopup': 'menu',
          'aria-expanded': open ? 'true' : 'false',
          onClick: (event) => {
            event.stopPropagation()
            if (open) ui.onCloseMenu()
            else ui.onOpenMenu(group.id)
          },
        }, '⋯'),
        open
          ? h('div', { key: 'menu', className: 'sm-menu', role: 'menu', style: S.menu }, children)
          : null,
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
        const [menuGroupId, setMenuGroupId] = React.useState(null)
        const [renaming, setRenaming] = React.useState(null)
        const [collapsed, setCollapsed] = React.useState(() => readCollapsed())
        const [selected, setSelected] = React.useState(() => new Set())
        const [selectionMode, setSelectionMode] = React.useState(false)
        const [query, setQuery] = React.useState('')
        const [statusFilter, setStatusFilter] = React.useState('all')
        const alive = React.useRef(true)

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

        React.useEffect(() => {
          if (menuGroupId === null) return undefined
          const onPointerDown = (event) => {
            const target = event.target
            if (target instanceof Element && (target.closest('.sm-menu') || target.closest('.sm-menu-trigger'))) return
            setMenuGroupId(null)
          }
          document.addEventListener('mousedown', onPointerDown)
          return () => document.removeEventListener('mousedown', onPointerDown)
        }, [menuGroupId])

        // Escape backs out one layer at a time: menu, rename, search, batch.
        React.useEffect(() => {
          if (menuGroupId === null && !selectionMode && renaming === null && query === '') return undefined
          const onKeyDown = (event) => {
            if (event.key !== 'Escape') return
            if (menuGroupId !== null) {
              setMenuGroupId(null)
              return
            }
            if (renaming !== null) {
              setRenaming(null)
              return
            }
            if (query !== '') {
              setQuery('')
              return
            }
            if (selectionMode) {
              setSelectionMode(false)
              setSelected(new Set())
            }
          }
          window.addEventListener('keydown', onKeyDown)
          return () => window.removeEventListener('keydown', onKeyDown)
        }, [menuGroupId, selectionMode, renaming, query])

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
              setNote(skipped > 0
                ? fill(t('page.note'), { applied: result.applied.length, skipped })
                : fill(t('page.noteClean'), { applied: result.applied.length }))
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

        const onSelectSkill = (name) => {
          setSelected((previous) => {
            const next = new Set(previous)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
          })
        }

        const onToggleCollapse = (sectionKey) => {
          setCollapsed((previous) => {
            const next = new Set(previous)
            if (next.has(sectionKey)) next.delete(sectionKey)
            else next.add(sectionKey)
            return next
          })
        }

        const groups = data !== null && Array.isArray(data.groups) ? data.groups : []
        const skills = data !== null && Array.isArray(data.skills) ? data.skills : []
        const stats = data !== null && data.stats !== null && typeof data.stats === 'object' ? data.stats : null

        const normalizedQuery = query.trim().toLowerCase()
        const matchesQuery = (skill) => {
          if (normalizedQuery === '') return true
          const haystack = `${skill.name} ${skill.description ?? ''} ${skill.source ?? ''} ${skill.provider ?? ''}`.toLowerCase()
          return haystack.includes(normalizedQuery)
        }
        const matchesStatus = (skill) => statusFilter === 'all'
          || (statusFilter === 'on' ? skill.enabled === true : skill.enabled !== true)
        const visibleSkills = skills.filter((skill) => matchesStatus(skill) && matchesQuery(skill))
        const visibleNames = new Set(visibleSkills.map((skill) => skill.name))
        const hasFilter = normalizedQuery !== '' || statusFilter !== 'all'

        const byGroup = new Map()
        const totalsByGroup = new Map()
        for (const group of groups) {
          byGroup.set(group.id, [])
          totalsByGroup.set(group.id, 0)
        }
        const ungrouped = []
        let totalUngrouped = 0
        for (const skill of skills) {
          if (typeof skill.groupId === 'string' && totalsByGroup.has(skill.groupId)) {
            totalsByGroup.set(skill.groupId, totalsByGroup.get(skill.groupId) + 1)
          } else {
            totalUngrouped += 1
          }
        }
        for (const skill of visibleSkills) {
          if (typeof skill.groupId === 'string' && byGroup.has(skill.groupId)) byGroup.get(skill.groupId).push(skill)
          else ungrouped.push(skill)
        }
        const countLabel = (visible, total) => (visible === total ? String(total) : `${visible}/${total}`)

        // Narrowing the filter drops hidden skills from the selection, so a
        // batch action can never touch something the list is not showing.
        React.useEffect(() => {
          setSelected((previous) => {
            if (previous.size === 0) return previous
            let dropped = false
            const next = new Set()
            for (const name of previous) {
              if (visibleNames.has(name)) next.add(name)
              else dropped = true
            }
            return dropped ? next : previous
          })
        }, [query, statusFilter])

        const onSelectSection = (sectionKey) => {
          const inSection = sectionKey === 'ungrouped' ? ungrouped : (byGroup.get(sectionKey) ?? [])
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

        const selectVisibleSkills = () => setSelected(new Set(visibleSkills.map((skill) => skill.name)))

        const invertSelection = () => setSelected((previous) => {
          const next = new Set(previous)
          for (const skill of visibleSkills) {
            if (next.has(skill.name)) next.delete(skill.name)
            else next.add(skill.name)
          }
          return next
        })

        const runBatch = async (op, extra) => {
          const names = [...selected]
          if (names.length === 0) return
          const next = await act(Object.assign({ action: 'batch', op, names }, extra ?? {}), 'batch')
          if (next !== null && alive.current) setSelected(new Set())
        }

        const toggleSelectionMode = () => {
          if (selectionMode) {
            setSelectionMode(false)
            setSelected(new Set())
            setMenuGroupId(null)
            return
          }
          setSelectionMode(true)
        }

        const clearFilters = () => {
          setQuery('')
          setStatusFilter('all')
        }

        const onCreateGroup = async () => {
          const name = draftGroup.trim()
          if (name === '') return
          const next = await act({ action: 'create_group', group: name }, 'group:create')
          if (next !== null && alive.current) setDraftGroup('')
        }

        const onDeleteGroup = async (group, confirming) => {
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
        }

        const onStartRename = (group) => {
          setMenuGroupId(null)
          setRenaming({ id: group.id, draft: group.name })
        }

        const onRenameDraft = (draft) => {
          setRenaming((current) => (current === null ? current : { id: current.id, draft }))
        }

        const onCancelRename = () => setRenaming(null)

        const onSaveRename = async () => {
          if (renaming === null) return
          const name = renaming.draft.trim()
          if (name === '') return
          const next = await act({ action: 'rename_group', group_id: renaming.id, to: name }, 'group:rename')
          if (next !== null && alive.current) setRenaming(null)
        }

        const moveGroup = (groupId, targetIndex) => {
          const ids = groups.map((group) => group.id)
          const from = ids.indexOf(groupId)
          if (from < 0 || targetIndex < 0 || targetIndex >= ids.length || targetIndex === from) return
          const ordered = ids.slice()
          ordered.splice(from, 1)
          ordered.splice(targetIndex, 0, groupId)
          act({ action: 'reorder_groups', ids: ordered }, 'group:reorder')
        }

        const onMoveGroup = (groupId, delta) => {
          const from = groups.findIndex((group) => group.id === groupId)
          if (from < 0) return
          moveGroup(groupId, from + delta)
        }

        const onMoveTop = (groupId) => moveGroup(groupId, 0)
        const onMoveBottom = (groupId) => moveGroup(groupId, groups.length - 1)

        const ui = {
          t,
          pending,
          groups,
          selected,
          selectionMode,
          collapsed,
          renaming,
          confirming: confirmGroup,
          menuGroupId,
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
          onMoveGroup,
          onMoveTop,
          onMoveBottom,
          onOpenMenu: (groupId) => setMenuGroupId(groupId),
          onCloseMenu: () => setMenuGroupId(null),
        }

        const sections = []
        if (ungrouped.length > 0) {
          sections.push(h(GroupSection, {
            key: 'ungrouped',
            t,
            ui,
            group: null,
            skills: ungrouped,
            countLabel: countLabel(ungrouped.length, totalUngrouped),
            first: true,
          }))
        }
        for (const group of groups) {
          const list = byGroup.get(group.id) ?? []
          if (hasFilter && list.length === 0) continue
          sections.push(h(GroupSection, {
            key: group.id,
            t,
            ui,
            group,
            skills: list,
            index: groups.indexOf(group),
            groupCount: groups.length,
            countLabel: countLabel(list.length, totalsByGroup.get(group.id) ?? 0),
            first: sections.length === 0,
          }))
        }

        const sectionKeys = (ungrouped.length > 0 ? ['ungrouped'] : []).concat(groups.map((group) => group.id))
        const allCollapsed = sectionKeys.length > 0 && sectionKeys.every((key) => collapsed.has(key))

        const enabledCount = skills.filter((skill) => skill.enabled === true).length

        const masthead = h('header', { key: 'masthead', style: S.masthead }, [
          h('div', { key: 'titles', style: { minWidth: 0 } }, [
            h('h1', { key: 'title', style: S.title }, t('page.title')),
            h('p', { key: 'subtitle', style: S.subtitle }, t('page.subtitle')),
          ]),
          h('button', {
            key: 'refresh',
            type: 'button',
            className: 'sm-quiet',
            style: S.textButton,
            disabled: status === 'loading' || pending !== '',
            onClick: () => load(),
          }, t('page.refresh')),
        ])

        const searchRow = h('div', { key: 'searchRow', style: S.searchRow }, [
          h('input', {
            key: 'search',
            type: 'search',
            value: query,
            placeholder: t('page.searchPlaceholder'),
            'aria-label': t('page.searchPlaceholder'),
            style: S.search,
            onChange: (event) => setQuery(event.target.value),
          }),
          h('div', { key: 'tabs', style: S.tabs }, [
            h(Tab, {
              key: 'all',
              label: t('page.filterAll'),
              count: skills.length,
              active: statusFilter === 'all',
              onClick: () => setStatusFilter('all'),
            }),
            h(Tab, {
              key: 'on',
              label: t('page.filterOn'),
              count: enabledCount,
              active: statusFilter === 'on',
              onClick: () => setStatusFilter('on'),
            }),
            h(Tab, {
              key: 'off',
              label: t('page.filterOff'),
              count: skills.length - enabledCount,
              active: statusFilter === 'off',
              onClick: () => setStatusFilter('off'),
            }),
          ]),
          hasFilter
            ? h('button', {
              key: 'clearFilters',
              type: 'button',
              className: 'sm-quiet',
              style: S.textButton,
              onClick: clearFilters,
            }, t('page.clearFilters'))
            : null,
        ])

        const selectionStrip = selectionMode
          ? h('div', { key: 'selection', style: S.selectionStrip }, [
            h('span', { key: 'count', style: S.selectionCount },
              `${t('page.selected')} ${selected.size} / ${visibleSkills.length}`),
            h('button', {
              key: 'all',
              type: 'button',
              className: 'sm-quiet',
              style: S.textButton,
              disabled: pending !== '',
              onClick: selectVisibleSkills,
            }, t('page.selectAll')),
            h('button', {
              key: 'invert',
              type: 'button',
              className: 'sm-quiet',
              style: S.textButton,
              disabled: pending !== '',
              onClick: invertSelection,
            }, t('page.invert')),
            h('button', {
              key: 'clear',
              type: 'button',
              className: 'sm-quiet',
              style: S.textButton,
              disabled: selected.size === 0,
              onClick: () => setSelected(new Set()),
            }, t('page.batchClear')),
            h('span', { key: 'divider', style: S.divider }),
            h('button', {
              key: 'enable',
              type: 'button',
              className: 'sm-quiet',
              style: S.textButton,
              disabled: pending !== '' || selected.size === 0,
              onClick: () => runBatch('enable'),
            }, t('page.batchEnable')),
            h('button', {
              key: 'disable',
              type: 'button',
              className: 'sm-quiet',
              style: S.textButton,
              disabled: pending !== '' || selected.size === 0,
              onClick: () => runBatch('disable'),
            }, t('page.batchDisable')),
            h('select', {
              key: 'move',
              value: '',
              disabled: pending !== '' || selected.size === 0 || groups.length === 0,
              'aria-label': t('page.batchMove'),
              title: t('page.batchMove'),
              style: S.input,
              onChange: (event) => {
                const groupId = event.target.value
                if (groupId !== '') runBatch('assign', { group_id: groupId })
              },
            }, [h('option', { key: '', value: '' }, t('page.batchMove'))].concat(
              groups.map((group) => h('option', { key: group.id, value: group.id }, group.name)),
            )),
            h('button', {
              key: 'ungroup',
              type: 'button',
              className: 'sm-quiet',
              style: S.textButton,
              disabled: pending !== '' || selected.size === 0,
              onClick: () => runBatch('ungroup'),
            }, t('page.batchUngroup')),
            h('span', { key: 'spacer', style: S.spacer }),
            h('button', {
              key: 'done',
              type: 'button',
              style: S.primary,
              onClick: toggleSelectionMode,
            }, t('page.done')),
          ])
          : null

        const normalActions = selectionMode
          ? null
          : h('div', { key: 'actions', style: S.actions }, [
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
              style: S.primary,
              disabled: draftGroup.trim() === '' || pending === 'group:create',
              onClick: onCreateGroup,
            }, t('page.addGroup')),
            h('span', { key: 'spacer', style: S.spacer }),
            h('button', {
              key: 'batchMode',
              type: 'button',
              style: S.secondary,
              disabled: skills.length === 0,
              onClick: toggleSelectionMode,
            }, t('page.batchMode')),
            h('button', {
              key: 'collapseAll',
              type: 'button',
              className: 'sm-quiet',
              style: S.textButton,
              disabled: sectionKeys.length === 0,
              onClick: () => {
                if (allCollapsed) {
                  setCollapsed(new Set())
                  return
                }
                const next = new Set()
                for (const key of sectionKeys) next.add(key)
                setCollapsed(next)
              },
            }, allCollapsed ? t('page.expandAll') : t('page.collapseAll')),
          ])

        const alerts = []
        if (error !== '') alerts.push(h('div', { key: 'error', style: S.alert }, error))
        if (note !== '') alerts.push(h('div', { key: 'note', style: S.noteLine }, note))
        if (stats !== null && stats.complete === false) {
          alerts.push(h('div', { key: 'incomplete', style: S.noteLine }, t('page.incomplete')))
        }
        if (stats !== null && stats.liveAgents === 0) {
          alerts.push(h('div', { key: 'noagent', style: S.noteLine }, t('page.noAgent')))
        }

        let body
        if (status === 'loading' && data === null) {
          body = [h('div', { key: 'loading', style: S.emptyState }, t('page.loading'))]
        } else if (status === 'error' && data === null) {
          body = [h('div', { key: 'failed', style: S.emptyAction }, [
            h('button', { key: 'retry', type: 'button', style: S.primary, onClick: () => load() }, t('page.retry')),
          ])]
        } else if (skills.length === 0) {
          body = [h('div', { key: 'empty', style: S.emptyState }, t('page.empty'))]
        } else if (visibleSkills.length === 0) {
          body = [h('div', { key: 'nomatch', style: S.emptyState }, [
            h('span', { key: 'text', style: { marginRight: 10 } }, t('page.noMatch')),
            h('button', {
              key: 'clear',
              type: 'button',
              className: 'sm-quiet',
              style: S.textButton,
              onClick: clearFilters,
            }, t('page.clearFilters')),
          ])]
        } else {
          body = sections
        }

        const footerText = typeof data?.statePath === 'string' && data.statePath !== ''
          ? `${t('page.footer')}  ${t('page.savedTo')}: ${data.statePath}`
          : t('page.footer')
        const footer = h('div', { key: 'footer', style: S.footer }, footerText)

        const children = [masthead, h('div', { key: 'rule1', style: S.rule }), searchRow, h('div', { key: 'rule2', style: S.rule })]
        if (normalActions !== null) children.push(normalActions)
        if (selectionStrip !== null) children.push(selectionStrip)
        if (alerts.length > 0) children.push(h('div', { key: 'alerts', style: S.alerts }, alerts))
        children.push(...body, footer)

        return h('div', { className: 'sm-panel', style: S.page }, [
          h('style', { key: 'sm-style' }, STYLE_TEXT),
          h('div', { key: 'inner', style: S.inner }, children),
        ])
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
