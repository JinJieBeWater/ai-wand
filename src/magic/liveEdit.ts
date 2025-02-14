import type { QuickPickItem } from 'vscode'
import { logger } from '../utils/logger'
import { type Magic, MagicMode } from '../types/magic'
import { useProviderToggle } from '../editor/quickPick/useProviderToggle'
import { settings } from '../configs/settings'
import { createCommonQuickPick } from '../editor/quickPick'
import { sparkMagic } from '.'

const items: QuickPickItem[] = [
  {
    label: 'Context',
    description: 'The context sent to the model',
    detail: '$(gear) ' + 'Selection',
    alwaysShow: true,
  },
  {
    label: 'Provider',
    description: 'The Model Provider',
    detail: '$(gear) ' + `${settings['status.activeProvider']} ${settings[`provider.${settings['status.activeProvider']}Model`]}`,
    alwaysShow: true,
  },
]

const submitItem: QuickPickItem = {
  label: 'Submit',
  detail: '$(zap) ' + 'Enter',
  alwaysShow: true,
}

function createLiveEditQP() {
  const qp = createCommonQuickPick()

  qp.title = `${qp.title} - Live Edit`
  qp.placeholder = 'Input your prompt'
  qp.items = items

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
      qp.items = [submitItem, ...items]
      qp.activeItems = [submitItem]
    }
    else {
      qp.items = items
    }
  })
  qp.onDidAccept(() => {
    switch (qp.activeItems[0].label) {
      case 'Submit':
        magic.prompt = qp.value
        logger.info('Live Edit Submit', magic.prompt)
        sparkMagic(magic)
        break
      case 'Context':
        logger.info('Live Edit Context')
        break
      case 'Provider':
        logger.info('Live Edit Provider')
        useProviderToggle()
        break
      default:
        logger.info('Live Edit Default')
        break
    }
    qp.hide()
  })
  qp.show()
}
