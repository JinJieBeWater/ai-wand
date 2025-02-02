// import { Position, Range, Selection, window, workspace } from 'vscode'
// import { useEvent } from 'reactive-vscode'
// import type { Magic } from '../types/magic'
// import { createMessageButler } from '../AISDK/createMessageButler'
// import { cleanDecorations, setInsertedDecoration, setUnchangedDecoration } from '../editor/setDecoration'
// import { calibrateSelection } from '../editor/calibration'
// import { createGenerateText } from '../AISDK/createGenerateText'
// import { useDiffLines } from '../diff/useDiffLines'
// import { logger } from '../utils/logger'

// export async function sparkMagic(magic: Magic) {
//   const textEditor = window.activeTextEditor

//   const currentSelectedText = textEditor?.document.getText(textEditor.selection)

//   const msgButler = createMessageButler().addUser(currentSelectedText!, magic.prompt)

//   const fullResponse = await createGenerateText(msgButler.messages)

//   const diff = useDiffLines(currentSelectedText!, fullResponse.text)

//   diff.forEach((part) => {
//     logger.info('part', JSON.stringify(part))
//   })

//   const { calibratedRange } = calibrateSelection(textEditor!.selection)

//   textEditor?.edit((editBuilder) => {
//     setUnchangedDecoration(textEditor, calibratedRange)

//     const insertPosition = new Position(calibratedRange.end.line + 1, 0)

//     editBuilder.insert(insertPosition, fullResponse.text)

//     const lines = fullResponse.text.split('\n')
//     const endLine = insertPosition.line + lines.length - 1
//     const endCharacter = lines[lines.length - 1].length
//     const endPosition = new Position(endLine, endCharacter)

//     const insertedRange = new Range(insertPosition, endPosition)

//     // 确保在插入后再设置装饰
//     setImmediate(() => {
//       const { calibratedRange: calibratedInsertedRange } = calibrateSelection(new Selection(insertedRange.start, insertedRange.end))

//       setInsertedDecoration(textEditor!, calibratedInsertedRange)

//       textEditor?.revealRange(insertedRange, 1)
//       textEditor.selection = new Selection(insertedRange.start, insertedRange.start)
//     })
//   })

//   msgButler.addAssistant(fullResponse.text)

//   const onDidChangeDecorations = useEvent(workspace.onDidSaveTextDocument)
//   onDidChangeDecorations(() => {
//     cleanDecorations(textEditor!)
//   })
// }
