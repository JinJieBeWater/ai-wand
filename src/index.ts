import { defineExtension, useDisposable } from 'reactive-vscode'
import { languages } from 'vscode'
import { logger } from './utils/logger'
import { initCommands } from './commands'
import { MagicWandCodelensProvider } from './editor/codelens/MagicWandCodelensProvider'

const { activate, deactivate } = defineExtension(() => {
  initCommands()

  const magicWandCodelens = new MagicWandCodelensProvider()

  useDisposable(languages.registerCodeLensProvider('*', magicWandCodelens))

  logger.show()
})

export { activate, deactivate }
