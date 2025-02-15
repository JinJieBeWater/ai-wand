import { type QuickPickItem, QuickPickItemKind } from 'vscode'
import type { ProviderOptions } from '../../configs'
import { providerOptions, useConfig } from '../../configs'
import { createCommonQuickPick } from './createCommonQuickPick'

const config = useConfig()

export enum ProviderToggleMode {
  primaryProvider,
  editProvider,
}

export function useProviderToggle(mode = ProviderToggleMode.primaryProvider) {
  const items: QuickPickItem[] = []

  providerOptions.forEach((provider) => {
    const currentProvider = config.value.providers[provider]
    if (currentProvider.modelList.length === 0) {
      return
    }

    items.push({
      label: provider,
      kind: QuickPickItemKind.Separator,
    })

    currentProvider.modelList.forEach((model) => {
      items.push({
        label: model,
        description: provider,
        picked: provider === config.value.active.primaryProvider.provider,
        // buttons: [
        //   {
        //     iconPath: new ThemeIcon('gear'),
        //     tooltip: provider,
        //   },
        // ],
      })
    })
  })
  const qp = createCommonQuickPick()

  qp.title = `${qp.title} Provider Toggle`
  qp.placeholder = 'Select Model Provider'
  qp.items = items

  // qp.onDidTriggerItemButton((e) => {
  //   commands.executeCommand('workbench.action.openSettings', `${Meta.name}.provider.${e.item.label}.`)
  // })

  qp.onDidAccept(async () => {
    const selected = qp.selectedItems[0]
    const { label: model, description: provider } = selected
    if (selected) {
      switch (mode) {
        case ProviderToggleMode.primaryProvider:
          config.value.active.primaryProvider.provider = provider as ProviderOptions
          config.value.active.primaryProvider.model = model
          break
        case ProviderToggleMode.editProvider:
          config.value.active.editProvider.provider = provider as ProviderOptions
          config.value.active.editProvider.model = model
          break
      }
    }
    qp.dispose()
  })

  qp.show()

  return qp
}
