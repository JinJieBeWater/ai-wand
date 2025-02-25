import { type TextEditor, window } from 'vscode'

/**
 * 获取当前编辑器中选中的文本内容
 * @param textEditor VS Code文本编辑器实例
 * @returns 选中的文本内容
 * @throws 当没有选中任何文本时抛出错误
 */
export function getSelectedText(textEditor: TextEditor): string {
  if (!textEditor) {
    window.showErrorMessage('No active text editor')
    throw new Error('No active text editor')
  }
  const selectedText = textEditor.document.getText(textEditor.selection)

  // 检查选中的文本是否为空字符串或仅包含空白字符
  if (!selectedText || selectedText.trim().length === 0) {
    window.showErrorMessage('No text selected')
    throw new Error('No text selected')
  }

  return selectedText
}
