import { workspace } from 'vscode'
import type { Context } from '../magic'

export function SystemPrompt(_context: Context) {
  const prompt = `
# System Prompt

You are Magic Wand, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices.

## 定义

- "已有相关代码"的定义: 用户提供的可参考的代码, 是接下来用户提供的代码片段所在文件的全部内容以及其他相关的内容。
- "代码片段"的定义:  用户提供的在已有相关代码中已存在的代码片段, 是用户希望修改的代码
- "要求"的定义: 用户对代码片段的修改要求

## 你的职责

- 你将根据用户的提供的已有相关代码和要求，对用户提供的代码片段进行修改。

## 注意事项 !!! 

- 你生成的内容基于提供的代码片段, 并将直接覆盖用户提供的代码片段。
- 当未被允许使用 imort 导入语句时, 禁止使用导入语句(import)

## 输出规范

- 保留提供代码的格式和风格，包括缩进、注释、命名约定、末尾分号(;)等。
- 尽最大努力复用已有的代码, 禁止为未修改的代码添加分号(;)

## 示例
已有相关代码如下:
getSymbols.ts
import type { DocumentSymbol, Uri } from 'vscode'
import { commands } from 'vscode'

export async function getSymbols(uri: Uri) {
  const symbols = await commands.executeCommand<DocumentSymbol[]>(
    'vscode.executeDocumentSymbolProvider',
    uri,
  )
  return symbols
}
提供的代码片段:
export async function getSymbols(uri: Uri) {
  const symbols = await commands.executeCommand<DocumentSymbol[]>(
    'vscode.executeDocumentSymbolProvider',
    uri,
  )
  return symbols
}

我的需求是:
优化代码

请按照我的需求修改代码片段, 并直接返回。

/**
 * 获取指定URI的文档符号。
 * @param uri 文档的URI。
 * @returns 文档符号数组，如果获取失败则返回undefined。
 */
export async function getSymbols(uri: Uri): Promise<DocumentSymbol[] | undefined> {
  try {
    const symbols = await commands.executeCommand<DocumentSymbol[]>(
      'vscode.executeDocumentSymbolProvider',
      uri,
    )
    return symbols
  } catch (error) {
    // 记录错误，以便调试
    console.error('Failed to get symbols:', error)
    return undefined
  }
}`
  return prompt
}

const regex = /[^./\\][\n\r\u2028\u2029]*(?:[^\n\r./\\\u2028\u2029][^./\\]+|(?:[^\n\r./\\\u2028\u2029][/\\]|(?:[./\\]|[^\n\r./\\\u2028\u2029]\.)[^.]|[^\n\r./\\\u2028\u2029][^./\\]+(?:[/\\]|\.[^.]))[^.]*)$/

export function UserPrompt(context: Context, code: string, prompt: string) {
  const { language, textEditor, code: originalText, magic } = context
  const fileName = regex.exec(textEditor.document.fileName)?.[0]

  let msg = `
# User Prompt
`

  const { currentFile, openTabs } = magic.context ?? {}
  let codeContext = ''
  // currentFile 默认开启
  if (currentFile === undefined || currentFile) {
    // 使用正则匹配文件名

    codeContext += `${fileName}\n`
    codeContext += `${textEditor.document.getText()}\n`
  }

  if (openTabs) {
    workspace.textDocuments.forEach((doc) => {
      if (doc.fileName === textEditor.document.fileName)
        return
      codeContext += `\n${regex.exec(doc.fileName)?.[0]}\n`
      codeContext += `${doc.getText()}\n`
    })
  }

  if (codeContext.length > 0) {
    msg += `
## 已有相关代码如下:
${codeContext}
`
  }

  msg += `
## 在${fileName}文件中, 有以下代码片段:
${code}
`

  msg += `
## 我的需求是:
${prompt}

请按照我的需求修改代码片段, 并直接返回。
`

  const isImportStatement = textEditor.document.getText() === originalText
  const isFencedCodeBlocks = language !== undefined && ['md', 'mdx', 'markdown'].includes(language)

  if (isFencedCodeBlocks || isImportStatement) {
    msg += `
## 输出规范:`
    if (isFencedCodeBlocks) {
      msg += `允许使用md代码块包裹, 但仅仅只在确定必要的时候`
    }
    if (isImportStatement) {
      msg += `允许使用import语句, 但仅仅只在确定必要的时候`
    }
  }
  return msg
}
