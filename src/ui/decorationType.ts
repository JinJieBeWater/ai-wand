import type { TextEditor } from 'vscode'
import { DecorationRangeBehavior, OverviewRulerLane, ThemeColor, window } from 'vscode'

// 定义 幽灵文本 的颜色
export const GHOST_TEXT_COLOR = new ThemeColor('editorGhostText.foreground')

export const UNCHANGED_DECORATION = window.createTextEditorDecorationType({
  isWholeLine: true,
  backgroundColor: new ThemeColor('diffEditor.unchangedCodeBackground'),
  rangeBehavior: DecorationRangeBehavior.OpenClosed,
})

export const INSERTED_DECORATION = window.createTextEditorDecorationType({
  isWholeLine: true,
  backgroundColor: new ThemeColor('diffEditor.insertedTextBackground'),
  borderColor: new ThemeColor('diffEditor.insertedTextBorder'),
  rangeBehavior: DecorationRangeBehavior.OpenOpen,
})

export function cleanDecorations(editor: TextEditor) {
  editor.setDecorations(UNCHANGED_DECORATION, [])
  editor.setDecorations(INSERTED_DECORATION, [])
}
