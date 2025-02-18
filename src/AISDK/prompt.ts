import { workspace } from 'vscode'
import type { Context } from '../magic'
import { logger } from '../utils/logger'

export function SystemPrompt(_context: Context) {
  const prompt = `You are Magic Wand, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices.

# User Input elements

## <instructions>
Instructions provided by the user. You must modify the code in <code> according to the requirements of the instructions and return the modified code.

## <code>
The code to be modified. You must make modifications based on this content.

### Attributes
- language: The programming language, such as ts, jsx, css, etc.
#### Example
\`<code language="ts">...</code>\` represents that the code language is TypeScript.

## <codeContext>
<codeContext>'s content is the context of the <code>.
<code> running in <codeContext>, so you can't return repitition code that already exists in <codeContext>.


## <outputRules>
The assistant output rules that must be followed

### Attributes
- fencedCodeBlocks: Whether to allow fenced code blocks in the output, default is false
#### Example
\`<outputRules fencedCodeBlocks="false" />\` represents that the output must not use fenced code blocks and must be returned directly without wrapping elements.

- importStatement: Whether to allow import statements in the output, default is false
#### Example
\`<outputRules importStatement="false" />\` represents that the output must not use import statements.

# Your Responsibilities

## Modify the code provided by the user directly according to the user's <instructions>.

# Output Rules

## Fenced code blocks / Other wrapping

- Even if you are allowed to use Fenced code blocks or Other wrapping, you must also use it when necessary.

## Import statement, similar to "import" or "require"

- When the importStatement is allowed, it must also be used when it is determined that it must be used.

## The output content should conform to the indentation of the original code.

## Formatting

- The output content should be formatted in the same style as the original code.
- You can't use any other formatting, such as adding extra spaces, line breaks, etc.
`
  return prompt
}

const regex = /[^./\\][\n\r\u2028\u2029]*(?:[^\n\r./\\\u2028\u2029][^./\\]+|(?:[^\n\r./\\\u2028\u2029][/\\]|(?:[./\\]|[^\n\r./\\\u2028\u2029]\.)[^.]|[^\n\r./\\\u2028\u2029][^./\\]+(?:[/\\]|\.[^.]))[^.]*)$/

export function UserPrompt(context: Context, code: string, prompt: string) {
  const { language, textEditor, originalText, magic } = context

  let msg = ``

  const { currentFile, openTabs } = magic.context ?? {}
  let codeContext = ''
  // currentFile 默认开启
  if (currentFile === undefined || currentFile) {
    // 使用正则匹配文件名

    const fileName = regex.exec(textEditor.document.fileName)?.[0]
    logger.info('currentFile', fileName)
    codeContext += `${fileName}\n`
    codeContext += `${textEditor.document.getText()}\n`
  }

  if (openTabs) {
    workspace.textDocuments.forEach((doc) => {
      if (doc.fileName === textEditor.document.fileName)
        return
      const fileName = regex.exec(doc.fileName)?.[0]
      codeContext += `\n${fileName}\n`
      codeContext += `${doc.getText()}\n`
    })
  }

  if (codeContext.length > 0) {
    msg += `
<codeContext>${codeContext}</codeContext>`
  }

  msg += `
<code language="${language || 'text'}">
${code}
</code>`

  msg += `
<instructions>
${prompt}
</instructions>`

  const isImportStatement = textEditor.document.getText() === originalText
  const isFencedCodeBlocks = language !== undefined && ['md', 'mdx', 'markdown'].includes(language)

  if (isFencedCodeBlocks || isImportStatement) {
    msg += `
    <outputRules fencedCodeBlocks="${isFencedCodeBlocks}" importStatement="${isImportStatement}" />`
  }
  return msg
}
