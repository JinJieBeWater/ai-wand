import { useStatusBarItem, watchEffect } from 'reactive-vscode'
import { StatusBarAlignment } from 'vscode'
import * as Meta from '../../generated/meta'
import { config } from '../../config'

function useProviderStatusBar() {
  const providerStatusBar = useStatusBarItem({
    id: 'providerStatusBar',
    alignment: StatusBarAlignment.Right,
    name: `${Meta.displayName} Toggle Provider`,
    text: `${config['status.activeProvider']} ${config[`provider.${config['status.activeProvider']}Model`]}`,
    tooltip: 'Click to toggle model provider',
    priority: 100,
    command: Meta.commands.toggleProvider,
  })

  watchEffect(() => {
    providerStatusBar.text = `🪄 ${config[`provider.${config['status.activeProvider']}Model`]}`
  })

  providerStatusBar.show()
}

export { useProviderStatusBar }
