import { defineExtension } from 'reactive-vscode'
import { window } from 'vscode'
import { logger } from './utils/logger'
import { initCommands } from './commands'

const { activate, deactivate } = defineExtension(() => {
  window.showInformationMessage('welcome to Magic Wand 🪄✨🔮')

  initCommands()

  logger.show()
})

export { activate, deactivate }
