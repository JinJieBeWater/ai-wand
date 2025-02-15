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
The relevant context of the provided code, which is used to refer to changes in <code>

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
`
  return prompt
}

export function UserPrompt(context: Context, code: string, prompt: string) {
  const { language, textEditor, originalText, magic } = context

  let msg = `
<instructions>
${prompt}
</instructions>
<code language="${language || 'text'}">
${code}
</code>`

  if (magic.context) {
    const { currentFile, openTabs } = magic.context
    let codeContext = ''
    // currentFile 默认开启
    if (currentFile === undefined || currentFile) {
      logger.info('currentFile', textEditor.document.fileName)
      codeContext += `${textEditor.document.fileName}\n`
      codeContext += `${textEditor.document.getText()}\n`
    }

    if (openTabs) {
      workspace.textDocuments.forEach((doc) => {
        if (doc.fileName === textEditor.document.fileName)
          return
        codeContext += `\n${doc.fileName}\n`
        codeContext += `${doc.getText()}\n`
      })
    }

    msg += `
    <codeContext>${codeContext}</codeContext>`
  }

  const isImportStatement = textEditor.document.getText() === originalText
  const isFencedCodeBlocks = language !== undefined && ['md', 'mdx', 'markdown'].includes(language)

  if (isFencedCodeBlocks || isImportStatement) {
    msg += `
    <outputRules fencedCodeBlocks="${isFencedCodeBlocks}" importStatement="${isImportStatement}" />`
  }
  return msg
}
