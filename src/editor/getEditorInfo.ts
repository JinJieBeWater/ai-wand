import { computed, useActiveTextEditor, useDocumentText, useTextEditorSelection } from 'reactive-vscode'
import { Position, Range, window } from 'vscode'

export function getEditorInfo() {
  const activeTextEditor = useActiveTextEditor()
  const selection = useTextEditorSelection(activeTextEditor)

  const selectedText = computed(() => activeTextEditor.value?.document.getText(selection.value))

  /** 最后一行的字符数 */
  const selectedEndLineCharacter = computed(() => {
    return selection.value.end.character
  })

  /**
   * 计算选中的最后一行
   * 如果最后一行没有字符 上移一行
   */
  const calibratedEndLine = computed(() => {
    if (selectedEndLineCharacter.value) {
      return selection.value.end.line
    }
    else {
      return selection.value.end.line - 1
    }
  })

  /** 选中的范围 */
  const selectedRange = computed(() => {
    // 计算终点位置
    const end = new Position(calibratedEndLine.value, selectedEndLineCharacter.value)
    return new Range(selection.value.start, end)
  })

  if (!activeTextEditor.value || !selection.value || !selectedText.value) {
    window.showErrorMessage('No selected code')
    throw new Error('No selected code')
  }

  return {
    activeTextEditor,
    selection,
    selectedText,
    selectedRange,
  }
}
