import { Selection, window } from 'vscode'
import { findSymbolAtLine } from './findSymbolAtLine'
import { getSymbols } from './getSymbols'

export async function selectAtLine(line: number) {
  const textEditor = window.activeTextEditor
  if (!textEditor)
    return

  const symbols = await getSymbols(textEditor.document.uri)

  if (!symbols)
    return

  const symbol = findSymbolAtLine(symbols, line)

  if (!symbol)
    throw new Error('symbol not found')

  window.activeTextEditor!.selection = new Selection(symbol.range.start, symbol.range.end)
}
