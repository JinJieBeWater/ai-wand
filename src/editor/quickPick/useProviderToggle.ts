import { type QuickPickItem, ThemeIcon, commands } from 'vscode'
import { providers } from '../../AISDK/providers'
import { settings } from '../../configs/settings'
import * as Meta from '../../generated/meta'
import { createCommonQuickPick } from './createCommonQuickPick'

export function useProviderToggle() {
  const items: QuickPickItem[] = providers.map(provider => ({
    label: provider,
    description: settings[`provider.${provider}Model`],
    picked: provider === settings['status.activeProvider'],
    buttons: [
      {
        iconPath: new ThemeIcon('gear'),
        tooltip: provider,
      },
    ],
  }))
  const qp = createCommonQuickPick()

  qp.title = `${qp.title} Provider Toggle`
  qp.placeholder = 'Select Model Provider'
  qp.items = items

  qp.onDidTriggerItemButton((e) => {
    commands.executeCommand('workbench.action.openSettings', `${Meta.name}.provider.${e.item.label}.`)
  })

  qp.onDidAccept(async () => {
    const selected = qp.selectedItems[0]
    if (selected) {
      settings.$set('status.activeProvider', selected.label)
    }
    qp.dispose()
  })

  qp.show()

  return qp
}
