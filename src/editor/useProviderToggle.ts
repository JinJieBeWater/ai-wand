import { type QuickPickItem, ThemeIcon, commands, window } from 'vscode'
import { providers } from '../AISDK/providers'
import { config } from '../config'
import * as Meta from '../generated/meta'

export function useProviderToggle() {
  const items: QuickPickItem[] = providers.map(provider => ({
    label: provider,
    description: config[`provider.${provider}Model`],
    picked: provider === config['status.activeProvider'],
    buttons: [
      {
        iconPath: new ThemeIcon('gear'),
        tooltip: provider,
      },
    ],
  }))
  const qp = window.createQuickPick()

  qp.title = `${Meta.displayName} Provider Toggle`
  qp.placeholder = 'Select Model Provider'
  qp.items = items

  qp.onDidTriggerItemButton((e) => {
    commands.executeCommand('workbench.action.openSettings', `${Meta.name}.provider.${e.item.label}.`)
  })

  qp.onDidAccept(async () => {
    const selected = qp.selectedItems[0]
    if (selected) {
      config.$set('status.activeProvider', selected.label)
    }
    qp.dispose()
  })

  qp.show()

  qp.onDidHide(() => qp.dispose())

  return qp
}
