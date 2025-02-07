# magic-wand

<a href="https://marketplace.visualstudio.com/items?itemName=JinJieBeWater.magic-wand" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/JinJieBeWater.magic-wand.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
<a href="https://kermanx.github.io/reactive-vscode/" target="__blank"><img src="https://img.shields.io/badge/made_with-reactive--vscode-%23007ACC?style=flat&labelColor=%23229863"  alt="Made with reactive-vscode" /></a>

## Configurations

<!-- configs -->
| Key                                    | Description                                                                               | Type      | Default                                     |
| -------------------------------------- | ----------------------------------------------------------------------------------------- | --------- | ------------------------------------------- |
| `magic-wand.magics`                    | Use the object's first-level property for group setting and the second for Magic setting. | `object`  | See package.json                            |
| `magic-wand.status.enableCodeLens`     | Enable CodeLens                                                                           | `boolean` | `true`                                      |
| `magic-wand.status.activeProvider`     | Active AI provider                                                                        | `string`  | `"openRouter"`                              |
| `magic-wand.provider.openRouterApiKey` | OpenRouter ApiKey                                                                         | `string`  | `""`                                        |
| `magic-wand.provider.openRouterModel`  | OpenRouter Model                                                                          | `string`  | `"meta-llama/llama-3.1-405b-instruct:free"` |
| `magic-wand.provider.deepseekApiKey`   | Deepseek ApiKey                                                                           | `string`  | `""`                                        |
| `magic-wand.provider.deepseekModel`    | Deepseek Model                                                                            | `string`  | `"deepseek-chat"`                           |
| `magic-wand.provider.ollamaApiKey`     | Ollama ApiKey                                                                             | `string`  | `""`                                        |
| `magic-wand.provider.ollamaModel`      | Ollama Model                                                                              | `string`  | `""`                                        |
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
