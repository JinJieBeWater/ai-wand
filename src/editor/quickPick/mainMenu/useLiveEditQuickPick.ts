import type { QuickPickItem } from 'vscode'
import type { Ref } from 'reactive-vscode'
import { computed } from 'reactive-vscode'
import { useConfig } from '../../../configs'
import { sparkMagic } from '../../../magic'
import type { Magic } from '../../../types/magic'
import { MagicContextMode, MagicMode } from '../../../types/magic'
import { useSaveMagicMenu } from '../saveMagicMenu/saveMagicMenu'
import { useEditContextQuickPick } from './useEditContextQuickPick'
import type { CreateMainMenuItemOptions } from './mainMenu'
import { createMainMenuItem } from './mainMenu'
import { useEditProviderToggle } from './useProviderToggle'

const config = useConfig()

enum QuickPickItemLabel {
  submit = 'Submit',
  context = 'Context',
  editProvider = 'Edit Provider',
}

const items: Ref<QuickPickItem[]> = computed(() => {
  return [
    {
      label: QuickPickItemLabel.submit,
      detail: `$(zap) ${config.value.active.editProvider.model}`,
      alwaysShow: true,
    },
    {
      label: QuickPickItemLabel.context,
      description: 'The context sent to the model',
      detail: `$(gear) ${MagicContextMode.currentFile}`,
      alwaysShow: true,
    },
    {
      label: QuickPickItemLabel.editProvider,
      description: 'Provider when on edit mode',
      detail: '$(gear) ' + `${config.value.active.editProvider.provider} ${config.value.active.editProvider.model}`,
      alwaysShow: true,
    },

  ]
})

function createLiveEditQuickPick(options: CreateMainMenuItemOptions & {
  magic: Magic
}) {
  const { magic } = options ?? {}
  const { qp, stack } = createMainMenuItem({
    id: 'useLiveEditQuickPick',
    ...options,
  })

  qp.title = `${qp.title} - Live Edit`
  qp.placeholder = 'Input your prompt'
  const currentItems = items.value
  let contextDetail = '$(gear)'
  Object.keys(magic.context!).forEach((key) => {
    if (magic.context![key as MagicContextMode]) {
      contextDetail += ` ${key}`
    }
  })
  currentItems[1].detail = contextDetail
  qp.items = currentItems

  qp.onDidHide(() => qp.dispose())

  return { qp, stack }
}

export function useLiveEditQuickPick(options?: CreateMainMenuItemOptions) {
  const preValue = options?.prevSelectedValue
  const magic: Magic = {
    prompt: '',
    mode: MagicMode.edit,
    context: {
      currentFile: true,
      openTabs: false,
    },
  }
  if (preValue) {
    const contextLabel = preValue.map(item => item.label) as MagicContextMode[]
    contextLabel.forEach((label) => {
      if (label in magic.context!) {
        magic.context![label] = true
      }
    })
  }
  const { qp, stack } = createLiveEditQuickPick({
    magic,
    ...options,
  })
  qp.value = options?.prevValue ?? magic.prompt
  qp.onDidAccept(() => {
    switch (qp.activeItems[0].label) {
      case QuickPickItemLabel.submit:
        if (!qp.value)
          return
        magic.prompt = qp.value
        sparkMagic(magic)
        useSaveMagicMenu({
          magic,
        })
        break
      case QuickPickItemLabel.context:
        useEditContextQuickPick({
          stack,
        })
        break
      case QuickPickItemLabel.editProvider:
        useEditProviderToggle({
          stack,
        })
        break
    }
    qp.hide()
  })
  qp.show()
}
