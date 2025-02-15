import useMagicQuickPick from '../editor/quickPick/useMagicQuickPick'

export function showMagics() {
  const qp = useMagicQuickPick()
  qp.show()
  return qp
}
