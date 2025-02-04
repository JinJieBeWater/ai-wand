import useMagicQuickPick from '../editor/useMagicQuickPick'
import { selectAiLine } from '../editor/selectAiLine'

export async function showMagics(args: number) {
  if (args !== undefined)
    selectAiLine(args)

  const qp = useMagicQuickPick()
  qp.show()
}
