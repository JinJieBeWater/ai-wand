import { defineExtension } from 'reactive-vscode'
import { initCommands } from './commands'
import { MagicWandCodelensProvider } from './editor/codelens/MagicWandCodelensProvider'
import { useProviderStatusBar } from './editor/statusBar/provider'
import { useConfig } from './configs'
import { logger } from './utils/logger'

const { activate, deactivate } = defineExtension(() => {
  initCommands()

  const _magicWandCodelens = new MagicWandCodelensProvider()

  useProviderStatusBar()

  useConfig()
  useConfig()

  if (import.meta.env.NODE_ENV === 'development') {
    logger.show()
  }
})

export { activate, deactivate }
