import { useStatusBarItem, watchEffect } from 'reactive-vscode'
import { StatusBarAlignment } from 'vscode'
import * as Meta from '../../generated/meta'
import { settings } from '../../configs/settings'

function useProviderStatusBar() {
  const providerStatusBar = useStatusBarItem({
    id: 'providerStatusBar',
    alignment: StatusBarAlignment.Right,
    name: `${Meta.displayName} Toggle Provider`,
    text: `${settings['status.activeProvider']} ${settings[`provider.${settings['status.activeProvider']}Model`]}`,
    tooltip: 'Click to toggle model provider',
    priority: 100,
    command: Meta.commands.toggleProvider,
  })

  watchEffect(() => {
    providerStatusBar.text = `🪄 ${settings[`provider.${settings['status.activeProvider']}Model`]}`
  })

  providerStatusBar.show()
}

export { useProviderStatusBar }
