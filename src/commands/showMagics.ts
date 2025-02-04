import { Selection, window } from 'vscode'
import { findSymbolAtLine } from '../editor/findSymbolAtLine'
import { getSymbols } from '../editor/getSymbols'
import useMagicQuickPick from '../editor/useMagicQuickPick'

export async function showMagics(args: number) {
  if (args !== undefined) {
    const line = args
    const textEditor = window.activeTextEditor
    if (!textEditor)
      return

    const symbols = await getSymbols(textEditor.document.uri)

    const symbol = findSymbolAtLine(symbols, line)

    if (!symbol)
      throw new Error('symbol not found')

    window.activeTextEditor!.selection = new Selection(symbol.range.start, symbol.range.end)
  }

  const qp = useMagicQuickPick()
  qp.show()
}
