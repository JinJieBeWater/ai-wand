import { type QuickPickItem, window } from 'vscode'
import { providers } from '../AISDK/providers'
import { config } from '../config'
import * as Meta from '../generated/meta'

export function useProviderToggle() {
  const items: QuickPickItem[] = providers.map(provider => ({
    label: provider,
    description: config[`provider.${provider}Model`],
    picked: provider === config['status.activeProvider'],
  }))
  const qp = window.createQuickPick()

  qp.title = `${Meta.displayName} Provider Toggle`
  qp.placeholder = 'Select Model Provider'
  qp.items = items

  qp.show()

  qp.onDidAccept(async () => {
    const selected = qp.selectedItems[0]
    if (selected) {
      config.$set('status.activeProvider', selected.label)
    }
    qp.dispose()
  })

  qp.onDidHide(() => qp.dispose())

  return qp
}
