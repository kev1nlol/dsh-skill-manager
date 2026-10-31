# SKILL 管理（DeepSeek Harness 插件）

[English](README.md) | 中文

给 [DeepSeek Harness](https://github.com/deepseek-ai) 增加一个侧栏 **SKILL 管理**面板：把已安装的技能按你自己的方式分组，并逐个启用 / 关闭。开关决定这个技能是否还被索引——模型的技能目录、`skill` 工具、`/技能名` 手势、输入框的 `/` 技能菜单——全程不改动、不删除任何技能文件。

> 第三方插件，与 DeepSeek 官方无隶属关系。

## 解决什么问题

Harness 的技能来自很多地方（内置包、`~/.dsh/skills`、项目目录、preset），目录长了每次请求都要付上下文成本，有些技能又只是偶尔用得上。这个插件给一个统一入口：

- 看到真正装进来的每个技能，以及它的来源与 provider；
- 按**你自己**的理解给它们建分组；
- 把吵的那几个关掉，需要时再打开。

## 功能

- **侧栏入口**：左栏出现 `SKILL 管理` 图标（order 15），点开是完整的主面板。
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
5. 鼠标停在分组的删除按钮上会说明后果：只删分组。

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
{ "action": "delete_group",  "group_id": "g-9a588124" }
{ "action": "assign",        "name": "office-docx", "group_id": "g-9a588124" }
```

`group` 与 `group_id` 都接受分组名或分组 id；空串表示移回「未分组」。

同样的操作以 `skill_manager` 工具暴露给模型，`action` 取 `list` / `enable` / `disable` / `create_group` / `delete_group` / `assign`。

## 说明与限制

- **面板不删技能**：要移除技能请去来源处删（`~/.dsh/skills/<name>/`、安装它的 bundle 等）。
- **冷会话**：没有活动 Agent 的会话，`/` 菜单可能走 preset 作用域的注册表，此时按 Agent 的遮蔽不生效；发一条消息激活 Agent 后，下一次取数即按开关过滤。
- **同源请求**：面板调用页面同源的 `/skill-manager/...`。已在 http 服务的 Web GUI 中验证；从 `file://` 加载界面的外壳可能解析不到这些路由。
- **没有拖拽**：用行内下拉框归组。
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
