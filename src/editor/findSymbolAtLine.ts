import type { DocumentSymbol } from 'vscode'

export function findSymbolAtLine(symbols: DocumentSymbol[], line: number): DocumentSymbol | undefined {
  for (const symbol of symbols) {
    if (symbol.range.start.line <= line && symbol.range.end.line >= line) {
      const childSymbol = findSymbolAtLine(symbol.children, line)
      if (childSymbol) {
        return childSymbol
      }
      return symbol
    }
  }
  return undefined
}
