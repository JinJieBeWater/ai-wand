import { type QuickPickItem, window } from 'vscode'
import { providers } from '../AISDK/providers'
import { config } from '../config'
import { logger } from '../utils/logger'

export function useProviderToggle() {
  const items: QuickPickItem[] = providers.map(provider => ({
    label: provider,
    description: config[`provider.${provider}Model`],
    picked: provider === config['status.activeProvider'],
  }))
  const qp = window.createQuickPick()

  qp.title = 'Select AI provider'
  qp.placeholder = 'Select AI provider'
  qp.items = items

  qp.show()

  qp.onDidAccept(async () => {
    const selected = qp.selectedItems[0]
    if (selected) {
      config.$set('status.activeProvider', selected.label)
      window.showInformationMessage(`switch to ${selected.label} provider and model ${selected.description}`)
    }
    qp.dispose()
  })

  return qp
}
