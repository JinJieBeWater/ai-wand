import { window } from 'vscode'
import { logger } from '../utils/logger'
import { useCms } from '../utils/useCms'
import useMagicQuickPick, { } from '../utils/useMagicQuickPick'

export function initCommands() {
  useCms({
    'magicWand.menu.showMagics': () => {
      const qp = useMagicQuickPick()
      qp.show()
    },
    'magicWand.menu.commands-settings': () => {
      window.showInformationMessage('magicWand.menu.commands-settings 🪄✨🔮')
      logger.info('commands-settings')
    },
  })
}
