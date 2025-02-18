import { workspace } from 'vscode'
import type { Context } from '../magic'
import { logger } from '../utils/logger'

export function SystemPrompt(_context: Context) {
  const prompt = `You are Magic Wand, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices.

# 你的职责

- 你将根据用户的提供的代码上下文和要求，对用户提供的代码段进行修改。
- 你生成的内容将被我直接插入到代码编辑器中，编辑器中已有相关的代码上下文，你生成的响应只会覆盖用户提供的代码段。

# 输出规范

- 保留提供代码的格式和风格，包括缩进、注释、命名约定、后缀是否加分号等。
`
  return prompt
}

const regex = /[^./\\][\n\r\u2028\u2029]*(?:[^\n\r./\\\u2028\u2029][^./\\]+|(?:[^\n\r./\\\u2028\u2029][/\\]|(?:[./\\]|[^\n\r./\\\u2028\u2029]\.)[^.]|[^\n\r./\\\u2028\u2029][^./\\]+(?:[/\\]|\.[^.]))[^.]*)$/

export function UserPrompt(context: Context, code: string, prompt: string) {
  const { language, textEditor, originalText, magic } = context
  const fileName = regex.exec(textEditor.document.fileName)?.[0]

  let msg = ``

  const { currentFile, openTabs } = magic.context ?? {}
  let codeContext = ''
  // currentFile 默认开启
  if (currentFile === undefined || currentFile) {
    // 使用正则匹配文件名

    logger.info('currentFile', fileName)
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
代码的上下文如下:
${codeContext}
`
  }

  msg += `
在${fileName}文件中, 有以下代码段:
${code}
`

  msg += `
我的需求是:
${prompt}

请按照我的需求修改代码段, 并返回修改后的代码, 不要输出任何其他内容。
`

  const isImportStatement = textEditor.document.getText() === originalText
  const isFencedCodeBlocks = language !== undefined && ['md', 'mdx', 'markdown'].includes(language)

  if (isFencedCodeBlocks || isImportStatement) {
    msg += `
    输出规范:`
    if (isFencedCodeBlocks) {
      msg += `允许使用md代码块包裹, 但仅仅只在确定必要的时候`
    }
    if (isImportStatement) {
      msg += `允许使用import语句, 但仅仅只在确定必要的时候`
    }
  }
  return msg
}
