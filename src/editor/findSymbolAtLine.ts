import type { DocumentSymbol } from 'vscode'

export function findSymbolAtLine(symbols: DocumentSymbol[], line: number, options = {
  deep: true,
}): DocumentSymbol | undefined {
  const { deep } = options
  for (const symbol of symbols) {
    if (symbol.range.start.line <= line && symbol.range.end.line >= line) {
      if (deep) {
        const childSymbol = findSymbolAtLine(symbol.children, line)
        if (childSymbol) {
          return childSymbol
        }
      }
      return symbol
    }
  }
  return undefined
}
