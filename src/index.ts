import { defineExtension } from 'reactive-vscode'
import { initCommands } from './commands'
import { MagicWandCodelensProvider } from './editor/codelens/MagicWandCodelensProvider'
import { useProviderStatusBar } from './editor/statusBar/provider'
import { logger } from './utils/logger'
import { useConfig } from './configs'

const { activate, deactivate } = defineExtension(() => {
  useConfig()

  initCommands()

  useProviderStatusBar()

  const _magicWandCodelens = new MagicWandCodelensProvider()

  if (import.meta.env.NODE_ENV === 'development') {
    logger.show()
  }
})

export { activate, deactivate }
