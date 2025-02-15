import { useStatusBarItem, watchEffect } from 'reactive-vscode'
import { StatusBarAlignment } from 'vscode'
import * as Meta from '../../generated/meta'
import { useConfig } from '../../configs'
import { logger } from '../../utils/logger'

const config = useConfig()

function useProviderStatusBar() {
  const providerStatusBar = useStatusBarItem({
    id: 'providerStatusBar',
    alignment: StatusBarAlignment.Right,
    name: `${Meta.displayName} Toggle Provider`,
    text: `🪄 ${config.value.active.primaryProvider.model}`,
    tooltip: 'Click to toggle model provider',
    priority: 100,
    command: Meta.commands.toggleProvider,
  })

  watchEffect(() => {
    providerStatusBar.text = `🪄 ${config.value.active.primaryProvider.model}`
  })

  providerStatusBar.show()
}

export { useProviderStatusBar }
