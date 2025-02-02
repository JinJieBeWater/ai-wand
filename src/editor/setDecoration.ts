import type { Range, TextEditor } from 'vscode'
import { INSERTED_DECORATION, UNCHANGED_DECORATION } from './decoration'

export function cleanDecorations(editor: TextEditor) {
  editor.setDecorations(UNCHANGED_DECORATION, [])
  editor.setDecorations(INSERTED_DECORATION, [])
}

export function setUnchangedDecoration(editor: TextEditor, range: Range) {
  editor.setDecorations(UNCHANGED_DECORATION, [range])
}

export function setInsertedDecoration(editor: TextEditor, range: Range) {
  editor.setDecorations(INSERTED_DECORATION, [range])
}
