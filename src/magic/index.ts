import type { TextEditor, TextEditorDecorationType } from 'vscode'
import { Position, Range, window } from 'vscode'
import type { Magic } from '../types/magic'
import type { MessageButler } from '../AISDK'
import { createMessageButler } from '../AISDK'
import { getSelectedText } from '../utils/getSelectedText'
import { createGenerateText } from '../AISDK/createGenerateText'
import type { Edit } from '../diff/computeDiff'
import { EditType, computeDiff } from '../diff/computeDiff'
import { createDeletionDecoration, createInsertedDecoration } from '../editor/decoration'

interface Instance {
  decoration: TextEditorDecorationType[]
}

export async function sparkMagic(magic: Magic) {
  const textEditor = window.activeTextEditor!
  const originalText = getSelectedText(textEditor!)
  const msgButler = createMessageButler().addUser(originalText, magic.prompt)

  const fullResponse = await createGenerateText(msgButler.messages)

  const diff = computeDiff(fullResponse, originalText, textEditor.selection, {
    decorateDeletions: true,
  })

  const diffEdit = async (part: Edit) => {
    const instance: Instance = {
      decoration: [],
    }
    await textEditor.edit((editBuilder) => {
      switch (part.type) {
        case EditType.Insertion:
          editBuilder.insert(part.range.start, part.text)
          setImmediate(() => {
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
    }).then(async (success) => {
      if (!success) {
        await diffEdit(part)
      }
    })
  }

  for (const part of diff) {
    await diffEdit(part)
  }
}
