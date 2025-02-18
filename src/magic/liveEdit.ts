import type { QuickPickItem } from 'vscode'
import type { Ref } from 'reactive-vscode'
import { computed } from 'reactive-vscode'
import { type Magic, MagicContextMode, MagicMode } from '../types/magic'
import { ProviderToggleMode, useProviderToggle } from '../editor/quickPick/useProviderToggle'
import type { CreateQuickPickOptions } from '../editor/quickPick'
import { QuickPickId, createCommonQuickPick } from '../editor/quickPick'

import { useConfig } from '../configs'
import { useEditContextQuickPick } from '../editor/quickPick/useEditContextQuickPick'
import { sparkMagic } from '.'

const config = useConfig()

enum QuickPickItemLabel {
  submit = 'Submit',
  context = 'Context',
  editProvider = 'Edit Provider',
}

// enum QuickPickItemTooltip {
//   toggleEditProvider = 'Toggle Edit Provider',
// }

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

function createLiveEditQP(options: CreateQuickPickOptions & {
  magic: Magic
}) {
  const { magic } = options ?? {}
  const { qp, stack } = createCommonQuickPick({
    id: QuickPickId.liveEdit,
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

  // qp.onDidTriggerItemButton((item) => {
  //   switch (item.button.tooltip) {
  //     case QuickPickItemTooltip.toggleEditProvider:
  //       useProviderToggle(ProviderToggleMode.editProvider)
  //       break
  //   }
  // })

  qp.onDidHide(() => qp.dispose())

  return { qp, stack }
}

export function liveEdit(value?: string, options?: CreateQuickPickOptions) {
  const preValue = options?.preValue
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
  const { qp, stack } = createLiveEditQP({
    magic,
    ...options,
  })
  qp.value = value ?? magic.prompt
  qp.onDidAccept(() => {
    switch (qp.activeItems[0].label) {
      case QuickPickItemLabel.submit:
        if (!qp.value)
          return
        magic.prompt = qp.value
        sparkMagic(magic)
        break
      case QuickPickItemLabel.context:
        useEditContextQuickPick({
          stack,
        })
        break
      case QuickPickItemLabel.editProvider:
        useProviderToggle(ProviderToggleMode.editProvider, {
          stack,
        })
        break
    }
    qp.hide()
  })
  qp.show()
}
