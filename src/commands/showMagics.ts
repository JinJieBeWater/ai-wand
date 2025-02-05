import type { CodeLens } from 'vscode'
import useMagicQuickPick from '../editor/useMagicQuickPick'
import { selectAiLine } from '../editor/selectAiLine'

export async function showMagics(codeLens: CodeLens) {
  if (codeLens !== undefined) {
    selectAiLine(codeLens.range.start.line)
  }

  const qp = useMagicQuickPick()
  qp.show()
}
