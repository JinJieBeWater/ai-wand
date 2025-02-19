import { reactive, watchEffect } from 'reactive-vscode'
import type { Disposable, Selection, TextEditor } from 'vscode'
import { Range, TextDocumentChangeReason, window, workspace } from 'vscode'
import type { Magic } from '../types/magic'
import { createMessageButler } from '../AISDK'
import { getSelectedText } from '../editor/getSelectedText'
import { computeDiff } from '../diff/computeDiff'
import type { lifeCycleInstance } from '../editor/diffEdit'
import { diffEdit } from '../editor/diffEdit'
import { connectAISDK } from '../AISDK/connectAISDK'
import { logger } from '../utils/logger'

export interface Context {
  magic: Magic
  textEditor: TextEditor
  /** 选中的原始文本 */
  code: string
  language?: string
  msgButler?: ReturnType<typeof createMessageButler>
}

type SparkMagic = (magic: Magic, options?: {
  selection?: Selection
  textEditor?: TextEditor
}) => Promise<lifeCycleInstance[] | undefined>

const sparkMagic: SparkMagic = async (magic: Magic, options) => {
  const textEditor = options?.textEditor ?? window.activeTextEditor!
  const selection = options?.selection ?? textEditor.selection
  const code = getSelectedText(textEditor!)
  const language = textEditor.document.fileName.split('.').pop()
  const originalText = textEditor.document.getText()
  const context: Context = {
    magic,
    textEditor,
    code,
    language,
  }
  const msgButler = createMessageButler(context).addUser(code, magic.prompt)
  context.msgButler = msgButler

  msgButler.messages.forEach((message) => {
    logger.info(message.role, message.content)
  })

  const replacement = await connectAISDK({
    context,
    messages: msgButler.messages,
    selection,
  })

  if (replacement === undefined)
    return

  const diff = computeDiff(replacement, code, selection, {
    decorateDeletions: true,
  })

  const instances = reactive(await diffEdit(textEditor, diff))
  const setInstances = (isActive: boolean, targetInstances: lifeCycleInstance[] = instances) => {
    targetInstances.forEach((instance) => {
      instance.isActive = isActive
    })
  }
  const disposables: Disposable[] = []

  disposables.push(workspace.onDidSaveTextDocument((e) => {
    if (e.uri.toString() === textEditor.document.uri.toString()) {
      setInstances(false)
      disposables.forEach(d => d.dispose())
    }
  }))

  let preLineCount = textEditor.document.lineCount
  disposables.push(workspace.onDidChangeTextDocument((e) => {
    if (e.document.uri.toString() === textEditor.document.uri.toString()) {
      const lineCount = e.document.lineCount
      const offset = lineCount - preLineCount
      preLineCount = lineCount

      const change = e.contentChanges[0]
      const changeStart = change.range.start.line
      const changeEnd = change.range.end.line
      if (e.document.isDirty) {
        switch (e.reason) {
          case TextDocumentChangeReason.Undo:
            logger.info('Undo')
            if (originalText === e.document.getText()) {
              setInstances(false)
              disposables.forEach(d => d.dispose())
            }
            break
          case TextDocumentChangeReason.Redo:
            break
          default: {
            const targetInstances: lifeCycleInstance[] = instances.filter((instance) => {
              const currentRange = instance.edit.range
              const currentRangeStart = currentRange.start.line
              const currentRangeEnd = currentRange.end.line

              return (
                change.range.contains(currentRange)
                || currentRange.contains(change.range)
                || (currentRangeStart >= changeStart && currentRangeStart < changeEnd)
                || (currentRangeEnd > changeStart && currentRangeEnd < changeEnd)
              )
            })
            setInstances(false, targetInstances)

            // 使用map优化范围校准
            instances.forEach((instance, index) => {
              const range = instance.edit.range
              if (range.end.line >= changeStart) {
                instances[index].edit.range = new Range(
                  range.start.line + offset,
                  range.start.character,
                  range.end.line + offset,
                  range.end.character,
                )
              }
            })
          }
        }
      }
      else {
        setInstances(false)
      }
    }
  }),
  )

  watchEffect(() => {
    instances.forEach((instance) => {
      if (!instance.isActive) {
        instance.decorations.forEach((decoration) => {
          textEditor.setDecorations(decoration, [])
        })
      }
    })
  })

  return instances
}

export { sparkMagic }
