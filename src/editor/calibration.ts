import { Position, Range, type Selection } from 'vscode'

export function calibrateSelection(selection: Selection) {
  /** 最后一行的字符数 */
  const endLineCharacter = selection.end.character

  /**
   * 计算选中的最后一行
   * 如果最后一行没有字符 上移一行
   */
  const calibratedEndLine = endLineCharacter ? selection.end.line : selection.end.line - 1

  /** 选中的范围 */
  const calibratedRange = new Range(selection.start, new Position(calibratedEndLine, endLineCharacter))

  return {
    calibratedEndLine,
    calibratedRange,
  }
}
