import process from 'node:process'
import { defineExtension } from 'reactive-vscode'
import { logger } from './utils/logger'
import { initCommands } from './commands'
import { MagicWandCodelensProvider } from './editor/codelens/MagicWandCodelensProvider'
import { useProviderStatusBar } from './editor/statusBar/provider'

const { activate, deactivate } = defineExtension(() => {
  initCommands()

  const _magicWandCodelens = new MagicWandCodelensProvider()

  useProviderStatusBar()

  if (process.env.NODE_ENV === 'development') {
    logger.show()
  }
})

export { activate, deactivate }
