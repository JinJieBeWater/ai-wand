import { Position, Selection, window } from 'vscode'
import { getSymbols } from '../editor/getSymbols'
import { findSymbolAtLine } from '../editor/findSymbolAtLine'
import useMagicQuickPick from '../editor/quickPick/mainMenu/useMagicQuickPick'

export function showMagics() {
  const textEditor = window.activeTextEditor!
  if (textEditor.selection?.start.character !== 0) {
    const start = new Position(textEditor.selection.start.line, 0)
    textEditor.selection = new Selection(start, textEditor.selection.end)
  }

  // if no selection, select the symbol at the cursor
  if (textEditor?.selection.isEmpty) {
    getSymbols(textEditor.document.uri).then((symbols) => {
      if (!symbols)
        return
      const symbol = findSymbolAtLine(symbols, textEditor.selection.active.line, {
        deep: false,
      })
      if (!symbol)
        return
      textEditor.selection = new Selection(symbol.range.start, symbol.range.end)
    })
  }

  const qp = useMagicQuickPick()
  return qp
}
