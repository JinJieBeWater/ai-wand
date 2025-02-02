import type { TextEditor } from 'vscode'
import { DecorationRangeBehavior, OverviewRulerLane, ThemeColor, window } from 'vscode'

export function createInsertedDecoration() {
  return window.createTextEditorDecorationType({
    isWholeLine: true,
    backgroundColor: new ThemeColor('diffEditor.insertedTextBackground'),
    borderColor: new ThemeColor('diffEditor.insertedTextBorder'),
    rangeBehavior: DecorationRangeBehavior.ClosedClosed,
  })
}

export function createDeletionDecoration(text: string) {
  return window.createTextEditorDecorationType({
    isWholeLine: true,
    backgroundColor: new ThemeColor('diffEditor.removedTextBackground'),
    borderColor: new ThemeColor('diffEditor.removedTextBorder'),
    rangeBehavior: DecorationRangeBehavior.ClosedClosed,
    before: {
      contentText: text,
      margin: '0 0 0 1em',
    },
  })
}
