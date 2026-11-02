# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-11-02

### Changed

- **Redesigned against the Anthropic `frontend-design` brief: a registry
  index, not a card gallery.** Structure comes from a fixed order column and
  hairline table rules; groups are open sections, and the page has no cards,
  shadows, or pills.
- Typography: one host family, three sizes, tabular numerals for counts and
  order indices, and monospace only for the skill identifier.
- Colour is a state signal: neutral chrome, brand for the active filter, batch
  mode and focus ring, status dots for on/off.
- Counts read as a sentence instead of three stat boxes; filters are underlined
  tabs, not chips; batch mode marks itself with a 2px top rule on the action
  strip.
- Rows lost their boxes: a quiet group picker outlines on hover, and the
  description is one line with the full text in its tooltip.
- Copy rewritten for plain verbs and actionable empty/error states; motion is
  limited to hover and state feedback and respects `prefers-reduced-motion`.

## [1.5.0] - 2026-11-02

### Changed

- **Panel layout rebuilt around one vertical rhythm**: header, filters, and a
  single action row, then the groups. Group actions moved behind one `⋯` menu
  (move up / down / to top / to bottom, rename, delete) instead of four
  always-visible buttons, and the whole group header toggles collapse.
- **Batch mode swaps the action row** instead of floating a bar over the list:
  select all / invert / clear, enable / disable, move / remove, and Done all
  sit in the normal row, so nothing overlaps the content.
- **Drag-and-drop reordering was removed.** Groups move with `↑` / `↓` and the
  menu, so ordering never fights the scroll position.
- Rows are calmer: one-line description with a full-text tooltip, a quiet group
  picker that outlines on hover, and the status pill on the right.
- Deleting a group asks inline under its own header, not in the group row.

## [1.4.0] - 2026-11-02

### Added

- **Search and status filters.** A search box matches skill names, descriptions,
  sources, and providers; the header counts became chips that filter by All,
  Enabled, or Disabled. Group headers show `visible/total` while a filter is
  active, and groups with no matches hide.
- **Invert selection** in the batch bar. Select-all and invert act on the
  visible rows only, and narrowing a filter drops hidden skills from the
  selection so a batch action can never touch an invisible skill.
- **Escape backs out one layer**: a rename, then the search, then batch mode.

### Changed

- Rows highlight on hover, and buttons, inputs, and selects show a visible
  keyboard focus ring (component-local styles, removed with the panel).

## [1.3.0] - 2026-11-02

### Changed

- **Batch mode is explicit.** A toolbar toggle turns selection on; checkboxes
  appear only in that mode and the action bar is pinned to the bottom of the
  panel (select all, clear, enable, disable, move, remove, exit). Clicking a
  row's text also toggles it, and section actions are hidden while the mode is
  on.
- **Sortable without dragging.** Every group header gained `↑` / `↓` buttons,
  and dragging a group near the top or bottom edge now auto-scrolls the panel,
  so reordering works on any window height. Header controls wrap instead of
  overflowing.

## [1.2.1] - 2026-11-02

### Fixed

- The collapse-all / expand-all control now accounts for the Ungrouped
  section, so it returns to "Expand all" instead of getting stuck when no
  named groups exist.

## [1.2.0] - 2026-11-02

### Added

- **Group management.** Rename a group in place, and reorder groups by dragging
  their `⠿` handle; the order is persisted in the state file.
- **Batch operations.** Select skills with per-row checkboxes or a section-wide
  checkbox, then enable, disable, move into a group, or remove from a group in
  one request. New `batch` action reports `applied` and `skipped`, and unknown
  names are skipped instead of failing the whole batch.
- **Collapse / expand.** Every group header collapses, plus a global
  collapse-all / expand-all control; the state is remembered per browser.
- New Host actions `rename_group`, `reorder_groups`, and `batch`, mirrored in
  the `skill_manager` tool.

### Changed

- The panel no longer renders an empty Ungrouped section, while named groups
  stay visible when empty so a freshly created group has a place to fill.
- Batch results surface as a short confirmation note under the toolbar.

## [1.1.1] - 2026-11-01

### Changed

- The plugin description defaults to Chinese; the English copy stays in
  `locale/en.json` for English locales.
- `README.md` is one bilingual document again: Chinese first, a horizontal
  rule, then English. `README.zh.md` was removed.

## [1.1.0] - 2026-11-01

### Added

- `skill_manager` agent tool so the model can list, toggle, group, and assign
  skills through the exact same implementation the panel uses.
- `provider`, `resolvedBy`, `modelInvocable`, and `userInvocable` fields in the
  state payload, so it is visible which provider currently wins a skill name
  and whether the skill is still indexed.
- Group members move back to Ungrouped when their group is deleted.

### Fixed

- Assigning a skill to a group failed with `unknown group "<id>"` when the
  caller passed a group id: `group` and `group_id` now both accept either a
  group name or a group id.
- The panel's group picker now sends `group_id` for a real group and an empty
  string when moving a skill back to Ungrouped.
- Disabling a skill that does not exist now fails with a clear `unknown skill`
  error instead of recording a phantom entry.
- An empty Ungrouped section no longer renders once every skill lives in a
  group; named groups stay visible while empty.
- The group-delete control now says "Delete group" and explains that only the
  group is removed, never the skills or their files.
- The per-row group picker no longer shows the misleading "Ungrouped" tooltip.

## [1.0.0] - 2026-10-31

### Added

- Sidebar entry and root-scoped main panel for managing installed skills.
- User-defined groups stored beside the Harness home; grouping is pure
  bookkeeping and never changes skill discovery.
- Per-skill on/off switch that publishes a rank-0, scope-local shadow provider
  (`modelInvocable: false`, `userInvocable: false`) on each live Agent, so the
  model skill catalog, the `skill` tool, `/name` gestures, and the composer's
  `/` skill menu stop indexing the skill without touching any skill file.
- Live catalog invalidation: toggling a skill makes the next `agent/pre-step`
  publish a replacement catalog.
- `GET /skill-manager/api/state` and `POST /skill-manager/api/action`, served
  from the Host web server on the loopback interface only.
- English and Chinese dictionaries, an exported icon, and localized
  `meta.title` / `meta.description` for the plugin manager.
