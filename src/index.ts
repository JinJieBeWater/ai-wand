import { defineExtension } from 'reactive-vscode'
import { logger } from './utils/logger'
import { initCommands } from './commands'

const { activate, deactivate } = defineExtension(() => {
  initCommands()

  logger.show()
})

export { activate, deactivate }
