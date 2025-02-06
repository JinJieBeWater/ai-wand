import useMagicQuickPick from '../editor/useMagicQuickPick'

export function showMagics() {
  const qp = useMagicQuickPick()
  qp.show()
  return qp
}
