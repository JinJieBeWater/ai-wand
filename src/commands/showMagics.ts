import { Selection, window } from 'vscode'
import useMagicQuickPick from '../editor/quickPick/useMagicQuickPick'
import { getSymbols } from '../editor/getSymbols'
import { findSymbolAtLine } from '../editor/findSymbolAtLine'

export function showMagics() {
  const textEditor = window.activeTextEditor
  if (textEditor?.selection.isEmpty) {
    getSymbols(textEditor.document.uri).then((symbols) => {
      const symbol = findSymbolAtLine(symbols, textEditor.selection.active.line, {
        deep: false,
      })
      if (!symbol)
        return
      textEditor.selection = new Selection(symbol.range.start, symbol.range.end)
    })
  }

  const qp = useMagicQuickPick()
  qp.show()
  return qp
}
