import { Position, Range, Selection, window, workspace } from 'vscode'
import { useEvent } from 'reactive-vscode'
import type { Magic } from '../types/magic'
import { createMessageButler } from '../AISDK/createMessageButler'
import { cleanDecorations, setInsertedDecoration, setUnchangedDecoration } from '../editor/setDecoration'
import { calibrateSelection } from '../editor/calibration'
import { createGenerateText } from '../AISDK/createGenerateText'

export async function sparkMagic(magic: Magic) {
  const currentTextEditor = window.activeTextEditor

  const currentSelectedText = currentTextEditor?.document.getText(currentTextEditor.selection)

  const { calibratedRange } = calibrateSelection(currentTextEditor!.selection)

  const msgButler = createMessageButler()
  msgButler.addUser(currentSelectedText!, magic.prompt)

  const fullResponse: string = (await createGenerateText(msgButler.messages)).text

  if (fullResponse === '') {
    window.showErrorMessage('No response from the server')
    return
  }

  currentTextEditor?.edit((editBuilder) => {
    setUnchangedDecoration(currentTextEditor, calibratedRange)

    const insertPosition = new Position(calibratedRange.end.line + 1, 0)

    editBuilder.insert(insertPosition, fullResponse)

    const lines = fullResponse.split('\n')
    const endLine = insertPosition.line + lines.length - 1
    const endCharacter = lines[lines.length - 1].length
    const endPosition = new Position(endLine, endCharacter)

    const insertedRange = new Range(insertPosition, endPosition)

    setImmediate(() => {
      const { calibratedRange } = calibrateSelection(new Selection(insertedRange.start, insertedRange.end))

      setInsertedDecoration(currentTextEditor!, calibratedRange)

      currentTextEditor?.revealRange(insertedRange, 1)
      currentTextEditor.selection = new Selection(insertedRange.start, insertedRange.start)
    })
  })

  msgButler.addAssistant(fullResponse)

  const onDidChangeDecorations = useEvent(workspace.onDidSaveTextDocument)
  onDidChangeDecorations(() => {
    cleanDecorations(currentTextEditor!)
  })
}
