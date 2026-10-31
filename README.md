# SKILL Manager for DeepSeek Harness

English | [中文](README.zh.md)

A [DeepSeek Harness](https://github.com/deepseek-ai) plugin that adds a **SKILL Manager** panel to the sidebar: group the skills installed in your Harness however you like, and switch individual skills on or off. The switch decides whether a skill is still indexed — for the model's skill catalog, the `skill` tool, `/name` gestures, and the composer's `/` skill menu — without editing or deleting a single skill file.

> Third-party plugin. Not affiliated with or endorsed by DeepSeek.

## Why

Harness skills come from many places (bundled packages, `~/.dsh/skills`, project roots, presets) and a long catalog costs context on every request. Some skills are also only occasionally useful. This plugin gives you one place to:

- see every skill that is actually installed, with its source and provider;
- arrange them into groups that are meaningful to **you**;
- turn the noisy ones off and back on at any time.

## Features

- **Sidebar entry.** A `SKILL 管理` / `SKILL Manager` icon in the left rail (order 15) opens a full main panel.
- **Groups are pure bookkeeping.** Names live in a JSON file next to your Harness home and never influence discovery, indexing, or loading. Deleting a group only drops the label: its members move back to *Ungrouped*, and no skill is removed or modified.
- **On/off is real.** Turning a skill off publishes a scope-local shadow provider on every live Agent that reports `invocation: { modelInvocable: false, userInvocable: false }` for that name. All consumers that resolve skills for an Agent therefore stop advertising and loading it, and the next `agent/pre-step` publishes a replacement catalog so the model learns about the change immediately.
- **Never touches skill files.** No `SKILL.md` is edited, moved, or deleted. Turning a skill back on simply withdraws the shadow.
- **Two callers, one implementation.** The panel and the `skill_manager` agent tool call the same Host code path.
- **Local HTTP API.** The panel reads and writes through two Host routes on the loopback interface, so you can script the same operations.
- **English + Chinese UI**, localized plugin metadata, and an exported icon.

## Requirements

- DeepSeek Harness `>= 0.2.1-rc.5` (declared as `engines.dsh`).
- Node `^22.19.0 || >=24.0.0` (whatever your Harness ships with).
- Tested on Windows with the Web GUI served over `http://127.0.0.1:<port>`.

## Install

### Through the plugin manager (recommended)

Ask the agent, or use the Plugins page, to install the bundle by its spec:

- npm: `@kev1nlol/dsh-skill-manager` (after it is published), or
- Git: `git+https://github.com/kev1nlol/dsh-skill-manager.git`

The plugin manager adds the package to your profile and selects the bundle. Reload the page once; the sidebar icon appears next to the other panel icons.

### From a checkout

```text
plugin_manager install_bundle → D:\path\to\dsh-skill-manager
```

The manager links the directory into the profile. Re-run it after changing the sources if your shell does not pick up the new module generation on its own.

### Manual profile entry

If you prefer editing the profile patch yourself, add the bundle row:

```yaml
- name: '@kev1nlol/dsh-skill-manager'
```

## Usage

1. Open the SKILL Manager panel from the sidebar.
2. Create a group (for example `个人安装` or `Official`) with the input at the top.
3. Use the group picker on any row to move that skill into a group, or back to *Ungrouped*.
4. Use the on/off pill on the right of a row to stop or resume indexing that skill. The row badge and the counters at the top update immediately.
5. Hover the delete control of a group to read what it does; it deletes only the group.

The panel starts the model's next step with a fresh skill catalog whenever you toggle something, so a disabled skill disappears from the model's `<available_skills>` list and from the `/` menu for that session.

## How the on/off switch works

The skill registry (`ctx.skills`) merges the process-global layer with the viewing scope's layer chain, and the nearest layer wins a duplicate name. For each live Agent this plugin registers a provider named `skill-manager` inside that Agent's own context, returning candidates with `rank: 0` for the disabled names only, carrying `modelInvocable: false` and `userInvocable: false`.

Consumers apply those flags at their own boundary:

| Consumer | Effect |
|---|---|
| `dsh-tool-skill` model catalog | the skill is filtered out; a replacement catalog is published on change |
| `skill` agent tool | refuses with `not available for model invocation` |
| `/name` user gesture | the skill is not injected |
| composer `/` skill menu (`skills/list`) | not listed while the session has a live Agent |

Toggling calls the provider's `invalidate()`; the registry drops its caches and the next step refreshes. The state file is the only thing written.

## Data and API

State lives in `$DSH_HOME/skill-manager.json` (`~/.dsh/skill-manager.json` by default):

```json
{
  "version": 1,
  "groups": [{ "id": "g-9a588124", "name": "Official" }],
  "assignments": { "office-docx": "g-9a588124" },
  "disabled": ["office-pptx"],
  "meta": { "office-pptx": { "description": "…", "source": "bundled", "provider": "dsh-office" } }
}
```

`meta` keeps the summary a skill had when it was disabled, so the panel can keep showing its name, source, and description while it is shadowed.

Host routes (same origin, loopback only):

| Route | Method | Meaning |
|---|---|---|
| `/skill-manager/api/state` | `GET` | skills, groups, counters, discovery state |
| `/skill-manager/api/action` | `POST` | one mutation, returns the same state payload |

`POST` bodies use `content-type: application/json` and one of:

```json
{ "action": "enable",        "name": "office-pptx" }
{ "action": "disable",       "name": "office-pptx" }
{ "action": "create_group",  "group": "Writing" }
{ "action": "delete_group",  "group_id": "g-9a588124" }
{ "action": "assign",        "name": "office-docx", "group_id": "g-9a588124" }
```

`group` and `group_id` both accept either a group name or a group id; an empty string moves a skill back to *Ungrouped*.

The same operations are available to the model as the `skill_manager` tool with `action` = `list`, `enable`, `disable`, `create_group`, `delete_group`, or `assign`.

## Notes and limitations

- **Skill files are read-only here.** The panel deliberately offers no "delete skill"; remove the skill at its source (`~/.dsh/skills/<name>/`, the installing bundle, and so on).
- **Cold sessions.** The `/` skill menu of a session that has no live Agent can be served from the preset-scope registry, where the per-Agent shadow does not apply. Sending one message activates the Agent and the filter applies from the next fetch.
- **Same-origin fetch.** The panel calls `/skill-manager/...` on the page's own origin. It is verified in the Web GUI served over http; a shell that loads the UI from `file://` may not resolve these routes.
- **No drag and drop.** Use the row's group picker.
- **Catalog completeness.** If a provider's discovery is incomplete, the panel says so and shows the last usable view.

## Development

The package is a bundle plus two runtime files:

| File | Role |
|---|---|
| `index.js` | Host half: state store, shadow providers, HTTP routes, `skill_manager` tool |
| `client.js` | Client half: sidebar icon and the manager panel (plain JS, React from the browser module table) |
| `cordis.patch.yml` | Loader row inserted by the bundle |
| `locale/*.json` | `meta.title` / `meta.description` for the plugin manager |
| `icon.svg` | Exported plugin icon |

Quick checks without installing:

```sh
node --check index.js
node --check client.js
node -e "JSON.parse(require('node:fs').readFileSync('package.json','utf8'))"
```

Install your checkout with `plugin_manager install_bundle <absolute path>`; the manager links the directory, so edits are picked up on the next reload or reinstall.

## License

[MIT](LICENSE) © 2026 kev1nlol
