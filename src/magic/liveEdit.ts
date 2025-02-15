import type { QuickPickItem } from 'vscode'
import type { Ref } from 'reactive-vscode'
import { computed } from 'reactive-vscode'
import { logger } from '../utils/logger'
import { type Magic, MagicMode } from '../types/magic'
import { ProviderToggleMode, useProviderToggle } from '../editor/quickPick/useProviderToggle'
import { createCommonQuickPick } from '../editor/quickPick'
import { useConfig } from '../configs'
import { sparkMagic } from '.'

const config = useConfig()

enum QuickPickItemLabel {
  submit = 'Submit',
  context = 'Context',
  editProvider = 'Edit Provider',
}

const items: Ref<QuickPickItem[]> = computed(() => {
  return [
    {
      label: QuickPickItemLabel.context,
      description: 'The context sent to the model',
      detail: '$(gear) ' + 'Selection',
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

const submitItem: QuickPickItem = {
  label: QuickPickItemLabel.submit,
  detail: '$(zap) ' + 'Enter',
  alwaysShow: true,
}

function createLiveEditQP() {
  const qp = createCommonQuickPick()

  qp.title = `${qp.title} - Live Edit`
  qp.placeholder = 'Input your prompt'
  qp.items = items.value

  qp.onDidHide(() => qp.dispose())

  return qp
}

export function liveEdit(value?: string) {
  const magic: Magic = {
    prompt: '',
    mode: MagicMode.edit,
  }
  const qp = createLiveEditQP()
  qp.value = value ?? magic.prompt
  qp.onDidChangeValue((e) => {
    if (e) {
      qp.items = [submitItem, ...items.value]
      qp.activeItems = [submitItem]
    }
    else {
      qp.items = items.value
    }
  })
  qp.onDidAccept(() => {
    switch (qp.activeItems[0].label) {
      case QuickPickItemLabel.submit:
        magic.prompt = qp.value
        sparkMagic(magic)
        break
      case QuickPickItemLabel.context:
        logger.info('Live Edit Context')
        break
      case QuickPickItemLabel.editProvider:
        useProviderToggle(ProviderToggleMode.editProvider)
        break
    }
    qp.hide()
  })
  qp.show()
}
