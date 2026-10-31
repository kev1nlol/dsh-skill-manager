# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
