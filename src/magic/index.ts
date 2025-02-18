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
  originalText: string
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
  const originalText = getSelectedText(textEditor!)
  const language = textEditor.document.fileName.split('.').pop()
  const context: Context = {
    magic,
    textEditor,
    originalText,
    language,
  }
  const msgButler = createMessageButler(context).addUser(originalText, magic.prompt)
  context.msgButler = msgButler

  const replacement = await connectAISDK({
    context,
    messages: msgButler.messages,
    selection,
  })

  if (replacement === undefined)
    return

  const diff = computeDiff(replacement, originalText, selection, {
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
        const targetInstances: lifeCycleInstance[] = []

        switch (e.reason) {
          case TextDocumentChangeReason.Undo:
            logger.info('Undo')
            break
          case TextDocumentChangeReason.Redo:
            logger.info('Redo')
            break
          default:
            // undo delete
            logger.info('Default')
            logger.info('变更的范围', JSON.stringify(change))
            instances.forEach((instance) => {
              const currentRange = instance.edit.range
              const currentRangeStart = currentRange.start.line
              const currentRangeEnd = currentRange.end.line
              if (change.range.contains(instance.edit.range)) {
                logger.info(`变更的范围包含实例的范围`, JSON.stringify(instance.edit.range))
                targetInstances.push(instance)
              }
              else if (instance.edit.range.contains(change.range)) {
                logger.info(`实例的范围包含变更的范围`, JSON.stringify(instance.edit.range))
                targetInstances.push(instance)
              }
              else if (currentRangeStart >= changeStart && currentRangeStart < changeEnd) {
                logger.info(`前沿重叠`, JSON.stringify(instance.edit.range))
                targetInstances.push(instance)
              }
              else if (currentRangeEnd > changeStart && currentRangeEnd < changeEnd) {
                logger.info(`后沿重叠`, JSON.stringify(instance.edit.range))
                targetInstances.push(instance)
              }
            })
            break
        }
        setInstances(false, targetInstances)

        // 校准范围
        // 修改受到影响的instance的range
        instances.forEach((instance) => {
          const range = instance.edit.range
          // 在影响范围内
          if (!(range.end.line < changeStart)) {
            const currentRange = new Range(
              range.start.line + offset,
              range.start.character,
              range.end.line + offset,
              range.end.character,
            )
            instance.edit.range = currentRange
          }
        })
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
