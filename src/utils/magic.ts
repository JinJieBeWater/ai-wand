import type { CoreMessage } from 'ai'
import { TypeValidationError } from 'ai'
import { Position, Range, Selection, ThemeColor, window, workspace } from 'vscode'
import { computed, useActiveEditorDecorations, useActiveTextEditor, useEditorDecorations, useEvent, useTextEditorSelection } from 'reactive-vscode'
import type { Magic } from '../types/magic'
import { INSERTED_DECORATION, UNCHANGED_DECORATION, cleanDecorations } from '../ui/decorationType'
import { createChat } from '../chat'
import { logger } from './logger'

export async function sparkMagic(magic: Magic) {
  const activeTextEditor = window.activeTextEditor

  if (!activeTextEditor) {
    window.showErrorMessage('No active editor')
    return
  }

  const document = activeTextEditor.document
  const selection = activeTextEditor.selection

  const code = document.getText(selection)

  const file_suffix = activeTextEditor?.document.fileName.split('.').pop()

  const codeEndLineLength = activeTextEditor?.document.lineAt(selection.end).text.length
  const codeEndLine = codeEndLineLength ? selection.end.line : selection.end.line - 1
  const codeRange = new Range(selection.start, new Position(codeEndLine, selection.end.character + 1))
  // 取消选中
  useActiveEditorDecorations(UNCHANGED_DECORATION, [codeRange])

  logger.info('codeRange', JSON.stringify(codeRange))

  activeTextEditor.selection = new Selection(selection.end, selection.end)

  const messages: CoreMessage[] = []

  messages.push({
    role: 'system',
    content: `You are a professional programming assistant. When I provide you with a piece of code from a file with the suffix ${file_suffix}, your task is to modify the code by adding or removing specific content according to my requirements. Make sure to strictly adhere to the syntax rules of the programming language corresponding to the ${file_suffix} file. Once the modifications are done, directly return the updated code without enclosing it in Markdown code blocks.`,
  })

  messages.push({
    role: 'user',
    content: `
    My code is as follows: ${code}
    My Requirements are as follows: ${magic.prompt}
    `,
  })

  logger.info('Start to spark magic')
  try {
    // 用于存储完整的响应
    const fullResponse = `editor.edit((editBuilder) => {
    // 在当前选中的位置的下方插入内容
    editBuilder.insert(selection.end, fullResponse);

    // 确保选择范围在插入之后正确计算
    const generatedSelection = new vscode.Selection(selection.end, selection.end.translate(0, fullResponse.length));

    // 设置装饰器
    editor.setDecorations(PREVIEW_RANGE_DECORATION, [generatedSelection]);
});`

    // // // 创建 AI 模型实例
    // const result = createChat(messages)
    // // // 遍历响应流
    // for await (const delta of result.textStream) {
    //   fullResponse += delta
    //   logger.append(`${delta}`)
    // }

    // // 预防服务器没有响应
    // if (fullResponse === '') {
    //   window.showErrorMessage('No response from the server')
    //   return
    // }

    activeTextEditor?.edit((editBuilder) => {
      const generated = codeEndLineLength ? `\n${fullResponse}` : fullResponse

      // 替换当前选中的内容
      editBuilder.replace(selection, generated)

      // 设置装饰器
      useActiveEditorDecorations(INSERTED_DECORATION, [new Range(selection.start, selection.end)])
    })

    messages.push({
      role: 'assistant',
      content: fullResponse,
    })

    // 保存清空EditorDecorations
    const onDidChangeDecorations = useEvent(workspace.onDidSaveTextDocument)
    onDidChangeDecorations(() => {
      cleanDecorations(activeTextEditor!)
    })
    // 撤回清空
  }
  catch (error) {
    if (TypeValidationError.isInstance(error)) {
      logger.info(error)
      window.showErrorMessage('Type validation fails. Maybe Server is not working')
    }
  }
}
