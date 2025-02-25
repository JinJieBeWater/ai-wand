import type { DocumentSymbol } from 'vscode'

/**
 * 在给定的符号数组中查找指定行号所在的符号
 * @param symbols 要搜索的符号数组
 * @param line 目标行号
 * @param options 搜索选项，包含是否深度搜索子符号
 * @returns 找到的符号，如果未找到则返回undefined
 */
export function findSymbolAtLine(
  symbols: DocumentSymbol[],
  line: number,
  options = {
    deep: true,
  },
): DocumentSymbol | undefined {
  const { deep } = options

  // 遍历符号数组查找目标行号所在的符号
  for (const symbol of symbols) {
    const isLineInSymbolRange
      = symbol.range.start.line <= line
        && symbol.range.end.line >= line

    if (isLineInSymbolRange) {
      // 如果启用深度搜索且当前符号有子符号，则递归搜索子符号
      if (deep && symbol.children?.length > 0) {
        const childSymbol = findSymbolAtLine(symbol.children, line, options)
        if (childSymbol) {
          return childSymbol
        }
      }
      return symbol
    }
  }

  return undefined
}
