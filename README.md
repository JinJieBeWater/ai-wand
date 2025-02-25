# AI Wand 🪄✨🔮

<a href="https://marketplace.visualstudio.com/items?itemName=JinJieBeWater.ai-wand" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/JinJieBeWater.ai-wand.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
<a href="https://kermanx.github.io/reactive-vscode/" target="__blank"><img src="https://img.shields.io/badge/made_with-reactive--vscode-%23007ACC?style=flat&labelColor=%23229863"  alt="Made with reactive-vscode" /></a>

AI Wand 🪄 是一款 VSCode 插件，它就像一根魔杖一样神奇。你可以预先为它配置提示词，然后只需选中代码，AI 就能按照你的意愿完成任务。
你还可以随时输入新的指令，在 AI 执行的同时，你可以快速将你的指令存储到提示词库中。
当你发现你在 LLM 聊天界面中重复的提问一些问题时, 不妨试试 AI Wand 吧

AI Wand 可以与其他 AI 插件完美配合使用

- [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) 或 [Roo-Code](https://github.com/RooVetGit/Roo-Code)用于 Agent 高级场景
- [AI Commit](https://marketplace.visualstudio.com/items?itemName=Sitoi.ai-commit) 用于生成 git 提交信息
- [supermaven](https://marketplace.visualstudio.com/items?itemName=supermaven.supermaven) 用于自动完成

> AI Wand 受到了 [Cody](https://github.com/sourcegraph/cody) 的启发, 痛苦于在使用 cody 过程中遇到的许多问题 `This feature has been disabled by your Sourcegraph site admin.🤣`, 以及 cody 本身并不支持自定义 AI 提供商, 因此 AI Wand 诞生了.

> ⚠️ **注意**: AI Wand 支持多种 AI 提供商和模型。虽然任何模型都可以使用，但高级模型通常能提供更好的效果。如果生成结果不理想，建议尝试更换更强大的模型。
## Features

- 🪄 通过 `alt + ~` 调出提示词快捷菜单快速使用
- ✨ 自定义你自己的提示词库, 生成提示词快捷菜单
- ✏️ 内置 Edit 模式, 选中代码并输入你的要求, 让 AI 帮你完成任务, 且可快速存储到提示词库
- 🔮 支持多种 AI 提供商, 或者自定义 openai 适配的第三方代理, 使用你自己的 api key

## Advantages
- 🎯 功能单一, 自定义提示词库然后快速调用
- ⌨️ 只有一个快捷键 `alt + ~`, 即可调用所有功能
- 📝 拒绝一大长串的系统提示词, 低消耗, 保住钱包

## Todos

- [ ] 添加 diff 的确认功能, 局部应用结果
- [ ] 添加更多提示词配置项
  - [ ] 添加更多代码上下文
    - [x] 当前选中代码的整个文件
    - [x] vscode 可视的文件
    - [ ] vscode 当前打开的文件
    - [ ] ? 由 angent 自动分析代码目录 找出最合适的上下文
  - [ ] 添加提示词对应模式 edit/ask/insert
    - [x] edit 模式下, 会修改选中的代码
    - [ ] ask 模式下, 打开侧边栏 chat 窗口
    - [ ] insert 模式下, 只会在选中代码的上下方插入代码
- [ ] 添加内置提示词, 提供更强功能
  - [ ] mermaid 将代码逻辑转换为 mermaid 并打开页面预览
- [ ] 添加侧边栏提示词快捷菜单
- [ ] 添加更多 AI 提供商
- [x] 探索其他保存用户配置方式

***

## Configurations

<!-- configs -->

| Key                             | Description     | Type      | Default |
| ------------------------------- | --------------- | --------- | ------- |
| `ai-wand.status.enableCodeLens` | Enable CodeLens | `boolean` | `true`  |

<!-- configs -->

## Commands

<!-- commands -->

| Command                          | Title                            |
| -------------------------------- | -------------------------------- |
| `ai-wand.openVscodeSettings`     | AI Wand: AI Wand vscode Settings |
| `ai-wand.openMagicWandConfig`    | AI Wand: AI Wand Config          |
| `ai-wand.showMagics`             | AI Wand: Spark a magic           |
| `ai-wand.toggleProvider`         | AI Wand: Toggle Provider         |
| `ai-wand.codelens.click`         | Codelens Click                   |
| `ai-wand.codelens.status.cancel` | Codelens Click                   |

<!-- commands -->

## License

[MIT](./LICENSE.md) License © 2025 [JinJieBeWater](https://github.com/JinJieBeWater)
