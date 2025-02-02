import type { TextEditor, TextEditorDecorationType } from 'vscode'
import { Position, Range, window } from 'vscode'
import type { Magic } from '../types/magic'
import type { MessageButler } from '../AISDK'
import { createMessageButler } from '../AISDK'
import { getSelectedText } from '../utils/getSelectedText'
import { createGenerateText } from '../AISDK/createGenerateText'
import { EditType, computeDiff, makeDiffEditBuilderCompatible } from '../diff/computeDiff'
import { logger } from '../utils/logger'
import { createDeletionDecoration, createInsertedDecoration } from '../editor/decoration'

export interface SparkContext {
  magic: Magic
  textEditor: TextEditor
  msgButler: MessageButler
  fullResponse: string
  originalText: string
}

export async function sparkMagic(magic: Magic) {
  const textEditor = window.activeTextEditor!
  const originalText = getSelectedText(textEditor!)
  const msgButler = createMessageButler().addUser(originalText, magic.prompt)

  const fullResponse = await createGenerateText(msgButler.messages)

  logger.info('fullResponse', fullResponse)

  const diff = computeDiff(fullResponse, originalText, textEditor.selection, {
    decorateDeletions: true,
  })
  textEditor.edit((editBuilder) => {
    diff.forEach((part) => {
      interface Instance {
        decoration: TextEditorDecorationType[]
      }
      const instance: Instance = {
        decoration: [],
      }
      switch (part.type) {
        case EditType.Insertion:
          editBuilder.insert(part.range.start, part.text)
          setImmediate(() => {
            logger.info('Insertion.range', JSON.stringify(part.range))
            logger.info('Insertion.text', JSON.stringify(part.text))
            instance.decoration.push(createInsertedDecoration())
            instance.decoration.forEach((decoration) => {
              textEditor.setDecorations(decoration, [part.range])
            })
          })
          break
        case EditType.Deletion:
          editBuilder.delete(part.range)
          break
        case EditType.DecoratedReplacement:
          editBuilder.replace(part.range, part.text)
          setImmediate(() => {
            const lines = part.oldText.split('\n')
            let position = part.range.start
            lines.forEach((line) => {
              const decoration = createDeletionDecoration(line)
              instance.decoration.push(decoration)
              textEditor.setDecorations(decoration, [new Range(position, position)])
              position = new Position(position.line + 1, 0)
            })
          })
          break
        default:
          throw new Error('Unknown edit type')
      }
    })
  })
}
