import { DecorationRangeBehavior, ThemeColor, window } from 'vscode'
import { logger } from '../utils/logger'

export function createInsertedDecoration() {
  return window.createTextEditorDecorationType({
    isWholeLine: true,
    backgroundColor: new ThemeColor('diffEditor.insertedTextBackground'),
    borderColor: new ThemeColor('diffEditor.insertedTextBorder'),
    rangeBehavior: DecorationRangeBehavior.ClosedClosed,
  })
}

export function createDeletionDecoration(text: string) {
  const prefixSpaces = text.match(/^\s*/)?.[0]?.length ?? 0
  return window.createTextEditorDecorationType({
    isWholeLine: true,
    backgroundColor: new ThemeColor('diffEditor.removedTextBackground'),
    borderColor: new ThemeColor('diffEditor.removedTextBorder'),
    rangeBehavior: DecorationRangeBehavior.ClosedClosed,
    before: {
      contentText: text,
      margin: `0 0 0 ${prefixSpaces}ch`,
    },
  })
}
