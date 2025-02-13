# Magic Wand 🪄✨🔮

<a href="https://marketplace.visualstudio.com/items?itemName=JinJieBeWater.magic-wand" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/JinJieBeWater.magic-wand.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
<a href="https://kermanx.github.io/reactive-vscode/" target="__blank"><img src="https://img.shields.io/badge/made_with-reactive--vscode-%23007ACC?style=flat&labelColor=%23229863"  alt="Made with reactive-vscode" /></a>

Magic Wand 🪄✨🔮 作为一个vscode插件, 就像使用一根魔杖一样, 你可以预先为魔杖配置魔法, 然后选中目标, 随心所欲的释放合适的魔法.

你可以将 Magic Wand 与其他 AI 插件结合使用

- [supermaven](https://marketplace.visualstudio.com/items?itemName=supermaven.supermaven) 用于自动完成
- [AI Commit](https://marketplace.visualstudio.com/items?itemName=Sitoi.ai-commit) 用于生成 git 提交信息
- [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) 或 [CoolCline](https://marketplace.visualstudio.com/items?itemName=CoolCline.coolcline) 用于 Agent 高级场景

Magic Wannd 专注于碎片化场景, 专注于小任务, 因此也低消耗

> Magic Wand 受到了 [Cody](https://github.com/sourcegraph/cody) 的启发, 痛苦于在使用 cody 过程中遇到的许多问题 `This feature has been disabled by your Sourcegraph site admin.🤣`, 以及 cody 本身并不支持自定义 AI 提供商, 因此 Magic Wand 诞生了.

> Magic Wand 仍在开发早期阶段, 只有基本功能

## Features

- ✨ 自定义你自己的提示词库, 生成提示词快捷菜单
- 🪄 通过 `alt + ~` 调出提示词快捷菜单快速使用
- 🔮 支持多种 AI 提供商, 或者自定义 openai 适配的第三方代理, 使用你自己的 api key

## Keep it simple

- 🎯 功能单一, 自定义提示词库然后快速调用, 没了
- 🎨 仅提供必要UI界面, 保持简洁
- 📝 拒绝一大长串的系统提示词, 保持简洁, 低消耗

## Todos

- [ ] 添加临时提示词输入功能
- [ ] 添加更多提示词配置项
  - [ ] 添加更多代码上下文
  - [ ] 添加提示词对应模式 edit/ask/insert
- [ ] 添加内置提示词, 提供更强功能
  - [ ] mermaid 将代码逻辑转换为 mermaid 并打开页面预览
- [ ] 添加侧边栏提示词快捷菜单
- [ ] 添加侧边栏快捷创建提示词
- [ ] 添加更多 AI 提供商
- [ ] 探索其他保存用户配置方式

***

## Configurations

<!-- configs -->

| Key                                             | Description                                                                               | Type      | Default                                     |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- | --------- | ------------------------------------------- |
| `magic-wand.magics`                             | Use the object's first-level property for group setting and the second for Magic setting. | `object`  | See package.json                            |
| `magic-wand.status.enableCodeLens`              | Enable CodeLens                                                                           | `boolean` | `true`                                      |
| `magic-wand.status.activeProvider`              | Active AI provider                                                                        | `string`  | `"openRouter"`                              |
| `magic-wand.provider.openRouterApiKey`          | OpenRouter ApiKey                                                                         | `string`  | `""`                                        |
| `magic-wand.provider.openRouterModel`           | OpenRouter Model                                                                          | `string`  | `"meta-llama/llama-3.1-405b-instruct:free"` |
| `magic-wand.provider.deepseekApiKey`            | Deepseek ApiKey                                                                           | `string`  | `""`                                        |
| `magic-wand.provider.deepseekModel`             | Deepseek Model                                                                            | `string`  | `"deepseek-chat"`                           |
| `magic-wand.provider.ollamaApiKey`              | Ollama ApiKey                                                                             | `string`  | `""`                                        |
| `magic-wand.provider.ollamaModel`               | Ollama Model                                                                              | `string`  | `""`                                        |
| `magic-wand.provider.openaiApiKey`              | OpenAI ApiKey                                                                             | `string`  | `""`                                        |
| `magic-wand.provider.openaiModel`               | OpenAI Model                                                                              | `string`  | `""`                                        |
| `magic-wand.provider.openaiAdaptedServerApiKey` | openaiAdaptedServer ApiKey                                                                | `string`  | `""`                                        |
| `magic-wand.provider.openaiAdaptedServerModel`  | openaiAdaptedServer Model                                                                 | `string`  | `""`                                        |
| `magic-wand.provider.openaiAdaptedServerUrl`    | openaiAdaptedServer Url                                                                   | `string`  | `""`                                        |

<!-- configs -->

## Commands

<!-- commands -->

| Command                             | Title                            |
| ----------------------------------- | -------------------------------- |
| `magic-wand.magics-settings`        | Magic Wand: Customize magic wand |
| `magic-wand.showMagics`             | Magic Wand: Spark a magic        |
| `magic-wand.toggleProvider`         | Magic Wand: Toggle Provider      |
| `magic-wand.codelens.click`         | Codelens Click                   |
| `magic-wand.codelens.status.cancel` | Codelens Click                   |

<!-- commands -->

## License

[MIT](./LICENSE.md) License © 2025 [JinJieBeWater](https://github.com/JinJieBeWater)
