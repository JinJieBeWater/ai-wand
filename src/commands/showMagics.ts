import useMagicQuickPick from '../editor/useMagicQuickPick'
import { selectAiLine } from '../editor/selectAiLine'
import { logger } from '../utils/logger'

export async function showMagics(args: number) {
  if (args !== undefined) {
    logger.info('showMagics', args)
    selectAiLine(args)
  }

  const qp = useMagicQuickPick()
  qp.show()
}
