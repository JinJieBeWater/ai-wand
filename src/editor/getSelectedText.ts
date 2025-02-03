import { type TextEditor, window } from 'vscode'

export function getSelectedText(textEditor: TextEditor) {
  const selectedText = textEditor.document.getText(textEditor.selection)
  if (!selectedText) {
    window.showErrorMessage('No selected text')
    throw new Error('No selected text')
  }
  return selectedText
}
