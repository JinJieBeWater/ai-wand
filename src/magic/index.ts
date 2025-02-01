import { Position, Range, Selection, window, workspace } from 'vscode'
import { useActiveEditorDecorations, useEvent, useTextEditorSelection } from 'reactive-vscode'
import type { Magic } from '../types/magic'
import { INSERTED_DECORATION, UNCHANGED_DECORATION, cleanDecorations } from '../editor/decoration'
import { createChat } from '../chat'
import { createMessageButler } from '../chat/createMessageButler'
import { getEditorInfo } from '../editor/getEditorInfo'
import { logger } from '../utils/logger'

export async function sparkMagic(magic: Magic) {
  const { activeTextEditor, selectedText, selectedRange, selection } = getEditorInfo()

  // 创建消息构建器
  const msgButler = createMessageButler()
  msgButler.addUser(selectedText.value!, magic.prompt)

  // 用于存储完整的响应
  const fullResponse = `useActiveEditorDecorations(UNCHANGED_DECORATION, [selectedRange.value])

    logger.info('selectedRange', JSON.stringify(selection.value))
    
    // 取消选中
    selection.value = new Selection(selection.value.end, selection.value.end)`

  // // // 创建 AI 模型实例
  // const result = createChat(msgButler.messages)
  // // // 遍历响应流
  // for await (const delta of result?.textStream) {
  //   fullResponse += delta
  //   logger.append(`${delta}`)
  // }
  // 预防服务器没有响应
  // if (fullResponse === '') {
  //   window.showErrorMessage('No response from the server')
  //   return
  // }

  activeTextEditor.value?.edit((editBuilder) => {
    useActiveEditorDecorations(UNCHANGED_DECORATION, [selectedRange.value])

    const insertPosition = new Position(selectedRange.value.end.line + 1, 0)

    editBuilder.insert(insertPosition, fullResponse)

    // 计算插入内容的结束位置
    const lines = fullResponse.split('\n')
    const endLine = insertPosition.line + lines.length - 1
    const endCharacter = lines[lines.length - 1].length
    const endPosition = new Position(endLine, endCharacter)

    // 创建插入内容的范围
    const insertedRange = new Range(insertPosition, endPosition)

    // 设置编辑器的选中范围
    selection.value = new Selection(insertedRange.start, insertedRange.end)

    setImmediate(() => {
      // 设置装饰器
      useActiveEditorDecorations(INSERTED_DECORATION, [insertedRange])
    })
  })

  msgButler.addAssistant(fullResponse)

  // 保存清空EditorDecorations
  const onDidChangeDecorations = useEvent(workspace.onDidSaveTextDocument)
  onDidChangeDecorations(() => {
    cleanDecorations(activeTextEditor.value!)
  })
}
