# SKILL 管理（DeepSeek Harness 插件）

![check](https://github.com/kev1nlol/dsh-skill-manager/actions/workflows/check.yml/badge.svg)

给 [DeepSeek Harness](https://github.com/deepseek-ai) 增加一个侧栏 **SKILL 管理**面板：把已安装的技能按你自己的方式分组，并逐个启用 / 关闭。开关决定这个技能是否还被索引——模型的技能目录、`skill` 工具、`/技能名` 手势、输入框的 `/` 技能菜单——全程不改动、不删除任何技能文件。

> 第三方插件，与 DeepSeek 官方无隶属关系。

## 解决什么问题

Harness 的技能来自很多地方（内置包、`~/.dsh/skills`、项目目录、preset），目录长了每次请求都要付上下文成本，有些技能又只是偶尔用得上。这个插件给一个统一入口：

- 看到真正装进来的每个技能，以及它的来源与 provider；
- 按**你自己**的理解给它们建分组；
- 把吵的那几个关掉，需要时再打开。

## 功能

- **侧栏入口**：左栏出现 `SKILL 管理` 图标（order 15），点开是完整的主面板。
- **分组真好管**：每个分组可**重命名**；用标题右侧的 `↑` / `↓` 按钮排序，或拖住左侧 `⠿` 手柄拖动（拖到面板上下边缘会自动滚动），顺序会持久化。
- **批量操作**：点工具栏「批量管理」进入批量模式，勾选行或整节；底部吸附一条操作条：全选 / 清空 / 批量启用 / 批量关闭 / 移到分组 / 移出分组 / 退出。
- **折叠 / 展开**：每个分组标题都能折叠，另有「全部折叠 / 全部展开」；折叠状态记在浏览器本地。
- **分组只是整理**：分组名存在 Harness 配置目录下的 JSON 里，不参与发现、索引、加载。删除分组只删标签——组内技能回到「未分组」，技能本身不受任何影响。
- **开关是真的**：关闭某个技能时，插件会在每个活动 Agent 自己的作用域里注册一个遮蔽 provider，对该名字报 `invocation: { modelInvocable: false, userInvocable: false }`。所有按 Agent 解析技能的消费方因此不再展示、不再加载它；下一个 `agent/pre-step` 会追加一份替换目录，模型立刻知道变化。
- **不碰技能文件**：不编辑、不移动、不删除 `SKILL.md`；重新打开只是撤掉遮蔽。
- **两个入口一套实现**：面板按钮与 `skill_manager` 智能体工具调用同一份宿主代码。
- **本机 HTTP 接口**：面板通过宿主上的两个回环地址路由读写，脚本也能直接用。
- **中英文界面**、本地化的插件元数据、导出的图标。

## 环境要求

- DeepSeek Harness `>= 0.2.1-rc.5`（写在 `engines.dsh` 里）。
- Node `^22.19.0 || >=24.0.0`（跟随 Harness 自带版本）。
- 已在 Windows + Web GUI（`http://127.0.0.1:<port>`）上验证。

## 安装

### 通过插件管理器（推荐）

用 Plugins 页面，或让智能体用 `plugin_manager` 安装这个 bundle：

- npm：`@kev1nlol/dsh-skill-manager`（发布后可用），或者
- Git：`git+https://github.com/kev1nlol/dsh-skill-manager.git`

安装完成后刷新一次页面，侧栏就会出现图标。

### 从本地 checkout 安装

```text
plugin_manager install_bundle → D:\path\to\dsh-skill-manager
```

管理器会把目录链接进 profile。改动源码后，如果你的 shell 没有自动加载新的模块代次，重新执行一次即可。

### 手动写进 profile

```yaml
- name: '@kev1nlol/dsh-skill-manager'
```

## 使用

1. 从侧栏打开面板；
2. 顶部输入框建分组（例如 `个人安装`、`官方内置`）；
3. 用每行右侧的下拉把技能移入分组，或移回「未分组」；
4. 用每行最右侧的开关停止 / 恢复索引，徽标与顶部计数立刻更新；
5. 点工具栏「批量管理」进入批量模式：勾选行或整节复选框（点行本身的文字区域也能勾选），底部吸附条提供全选 / 清空 / 启用 / 关闭 / 移到分组 / 移出分组 / 退出；
6. 分组标题右侧可「重命名」「删除分组」；删除只删分组（悬停有说明）；
7. 点标题前的 `▾` / `▸` 折叠或展开该分组，「全部折叠 / 全部展开」在工具栏右侧；
8. 分组排序：用标题右侧的 `↑` / `↓` 按钮，或拖动左侧 `⠿` 手柄（靠近面板上下边缘会自动滚动）。

每次切换都会让模型的下一步拿到新的技能目录，被关闭的技能会从 `<available_skills>` 和该会话的 `/` 菜单里消失。

## 关闭是怎么生效的

技能注册表（`ctx.skills`）会把「进程全局层」与「查看作用域的层链」合并，越近的层优先。插件在每个活动 Agent 自己的上下文里注册名为 `skill-manager` 的 provider，只为被关闭的名字返回 `rank: 0`、且带 `modelInvocable: false` / `userInvocable: false` 的候选。

各消费方在自己的边界上应用这些标志：

| 消费方 | 效果 |
|---|---|
| `dsh-tool-skill` 的模型目录 | 过滤掉该技能；变化时追加替换目录 |
| `skill` 工具 | 拒绝，返回 `not available for model invocation` |
| `/技能名` 手势 | 不再注入 |
| 输入框 `/` 技能菜单（`skills/list`） | 会话有活动 Agent 时不再列出 |

切换会调用 provider 的 `invalidate()`，注册表清缓存、下一步刷新。唯一被写入的是状态文件。

## 数据与接口

状态在 `$DSH_HOME/skill-manager.json`（默认 `~/.dsh/skill-manager.json`）：

```json
{
  "version": 1,
  "groups": [{ "id": "g-9a588124", "name": "官方内置" }],
  "assignments": { "office-docx": "g-9a588124" },
  "disabled": ["office-pptx"],
  "meta": { "office-pptx": { "description": "…", "source": "bundled", "provider": "dsh-office" } }
}
```

`meta` 保存技能被关闭时的摘要，使面板在遮蔽期间仍能显示名称、来源与描述。

宿主路由（同源、仅回环）：

| 路由 | 方法 | 作用 |
|---|---|---|
| `/skill-manager/api/state` | `GET` | 技能、分组、计数、发现状态 |
| `/skill-manager/api/action` | `POST` | 一次变更，返回同样的状态 |

`POST` 需要 `content-type: application/json`，body 形如：

```json
{ "action": "enable",        "name": "office-pptx" }
{ "action": "disable",       "name": "office-pptx" }
{ "action": "create_group",  "group": "写作" }
{ "action": "rename_group",  "group_id": "g-9a588124", "to": "官方技能" }
{ "action": "delete_group",  "group_id": "g-9a588124" }
{ "action": "assign",        "name": "office-docx", "group_id": "g-9a588124" }
{ "action": "reorder_groups","ids": ["g-b", "g-a"] }
{ "action": "batch",         "op": "disable", "names": ["office-pptx", "office-xlsx"] }
{ "action": "batch",         "op": "assign",  "names": ["office-docx"], "group_id": "g-9a588124" }
```

`group` 与 `group_id` 都接受分组名或分组 id；空串表示移回「未分组」。`batch` 的 `op` 取 `enable` / `disable` / `assign` / `ungroup`，结果里会附带 `applied` 与 `skipped`，未知技能名会被跳过而不是让整批失败。`reorder_groups` 必须把现有分组 id 恰好列全一次。

同样的操作以 `skill_manager` 工具暴露给模型，`action` 取 `list` / `enable` / `disable` / `batch` / `create_group` / `rename_group` / `delete_group` / `assign` / `reorder_groups`。

## 说明与限制

- **面板不删技能**：要移除技能请去来源处删（`~/.dsh/skills/<name>/`、安装它的 bundle 等）。
- **冷会话**：没有活动 Agent 的会话，`/` 菜单可能走 preset 作用域的注册表，此时按 Agent 的遮蔽不生效；发一条消息激活 Agent 后，下一次取数即按开关过滤。
- **同源请求**：面板调用页面同源的 `/skill-manager/...`。已在 http 服务的 Web GUI 中验证；从 `file://` 加载界面的外壳可能解析不到这些路由。
- **技能不能拖拽归组**：分组本身可以拖 `⠿` 手柄排序；技能归组用行内下拉框或批量条。
- **目录完整性**：某个 provider 发现不完整时，面板会提示，并展示最近一次可用结果。

## 开发

| 文件 | 作用 |
|---|---|
| `index.js` | 宿主半：状态存储、遮蔽 provider、HTTP 路由、`skill_manager` 工具 |
| `client.js` | 客户端半：侧栏图标与管理面板（纯 JS，React 来自浏览器模块表） |
| `cordis.patch.yml` | bundle 插入的 Loader 行 |
| `locale/*.json` | 插件管理器的 `meta.title` / `meta.description` |
| `icon.svg` | 导出的插件图标 |

不安装也能做的检查：

```sh
node --check index.js
node --check client.js
node -e "JSON.parse(require('node:fs').readFileSync('package.json','utf8'))"
```

用 `plugin_manager install_bundle <绝对路径>` 安装你的 checkout；管理器会链接目录，改完在下次刷新或重装后生效。

## 许可

[MIT](LICENSE) © 2026 kev1nlol

---

# SKILL Manager for DeepSeek Harness

A [DeepSeek Harness](https://github.com/deepseek-ai) plugin that adds a **SKILL Manager** panel to the sidebar: group the skills installed in your Harness however you like, and switch individual skills on or off. The switch decides whether a skill is still indexed — for the model's skill catalog, the `skill` tool, `/name` gestures, and the composer's `/` skill menu — without editing or deleting a single skill file.

> Third-party plugin. Not affiliated with or endorsed by DeepSeek.

## Why

Harness skills come from many places (bundled packages, `~/.dsh/skills`, project roots, presets) and a long catalog costs context on every request. Some skills are also only occasionally useful. This plugin gives you one place to:

- see every skill that is actually installed, with its source and provider;
- arrange them into groups that are meaningful to **you**;
- turn the noisy ones off and back on at any time.

## Features

- **Sidebar entry.** A `SKILL 管理` / `SKILL Manager` icon in the left rail (order 15) opens a full main panel.
- **Groups that are easy to manage.** Rename a group in place, then reorder groups with the `↑` / `↓` buttons or by dragging the `⠿` handle (dragging near the top or bottom edge auto-scrolls the panel); the order is persisted.
- **Batch operations.** Turn on *Batch actions* in the toolbar, tick rows or whole sections, and use the bar pinned to the bottom: select all, clear, enable, disable, move into a group, remove from a group, exit.
- **Collapse and expand.** Every group header collapses, plus a global collapse/expand control; the state is remembered in the browser.
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
5. Turn on *Batch actions* in the toolbar: tick rows or a whole section (clicking a row's text also toggles it), and the bar pinned to the bottom offers select all, clear, enable, disable, move into a group, remove from a group, and exit.
6. Rename or delete a group from its header; deleting only removes the group (hover for the explanation).
7. Click `▾` / `▸` to collapse or expand a group, or use *Collapse all* / *Expand all* in the toolbar.
8. Reorder groups with the `↑` / `↓` buttons or by dragging the `⠿` handle; dragging near the top or bottom edge auto-scrolls the panel.

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
{ "action": "rename_group",  "group_id": "g-9a588124", "to": "Official" }
{ "action": "delete_group",  "group_id": "g-9a588124" }
{ "action": "assign",        "name": "office-docx", "group_id": "g-9a588124" }
{ "action": "reorder_groups","ids": ["g-b", "g-a"] }
{ "action": "batch",         "op": "disable", "names": ["office-pptx", "office-xlsx"] }
{ "action": "batch",         "op": "assign",  "names": ["office-docx"], "group_id": "g-9a588124" }
```

`group` and `group_id` both accept either a group name or a group id; an empty string moves a skill back to *Ungrouped*. `batch` takes `op` = `enable`, `disable`, `assign`, or `ungroup`, and reports `applied` / `skipped`; unknown skill names are skipped instead of failing the whole batch. `reorder_groups` must list every group id exactly once.

The same operations are available to the model as the `skill_manager` tool with `action` = `list`, `enable`, `disable`, `batch`, `create_group`, `rename_group`, `delete_group`, `assign`, or `reorder_groups`.

## Notes and limitations

- **Skill files are read-only here.** The panel deliberately offers no "delete skill"; remove the skill at its source (`~/.dsh/skills/<name>/`, the installing bundle, and so on).
- **Cold sessions.** The `/` skill menu of a session that has no live Agent can be served from the preset-scope registry, where the per-Agent shadow does not apply. Sending one message activates the Agent and the filter applies from the next fetch.
- **Same-origin fetch.** The panel calls `/skill-manager/...` on the page's own origin. It is verified in the Web GUI served over http; a shell that loads the UI from `file://` may not resolve these routes.
- **No skill drag and drop.** Group rows are reordered by dragging their `⠿` handle; to regroup a skill use its row picker or the batch bar.
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
