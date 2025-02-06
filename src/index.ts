import { defineExtension } from 'reactive-vscode'
import { logger } from './utils/logger'
import { initCommands } from './commands'
import { MagicWandCodelensProvider } from './editor/codelens/MagicWandCodelensProvider'

const { activate, deactivate } = defineExtension(() => {
  initCommands()

  const magicWandCodelens = new MagicWandCodelensProvider()

  logger.info('activate', magicWandCodelens)

  logger.show()
})

export { activate, deactivate }
