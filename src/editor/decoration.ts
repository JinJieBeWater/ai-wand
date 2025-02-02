import type { TextEditor } from 'vscode'
import { DecorationRangeBehavior, OverviewRulerLane, ThemeColor, window } from 'vscode'

export const UNCHANGED_DECORATION = window.createTextEditorDecorationType({
  isWholeLine: true,
  backgroundColor: new ThemeColor('diffEditor.unchangedCodeBackground'),
  rangeBehavior: DecorationRangeBehavior.ClosedClosed,
})

export const INSERTED_DECORATION = window.createTextEditorDecorationType({
  isWholeLine: true,
  backgroundColor: new ThemeColor('diffEditor.insertedTextBackground'),
  borderColor: new ThemeColor('diffEditor.insertedTextBorder'),
  rangeBehavior: DecorationRangeBehavior.OpenOpen,
})
