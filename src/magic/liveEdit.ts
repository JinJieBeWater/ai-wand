import type { QuickPick, QuickPickItem } from 'vscode'
import { ThemeIcon, window } from 'vscode'
import { logger } from '../utils/logger'
import { type Magic, MagicMode } from '../types/magic'
import * as Meta from '../generated/meta'
import { openMagicsSettings } from '../commands/openSettings'
import { useProviderToggle } from '../editor/useProviderToggle'
import { sparkMagic } from '.'

const items: QuickPickItem[] = [
  {
    label: 'Context',
    description: 'The context sent to the model',
    alwaysShow: true,

  },
  {
    label: 'Provider',
    description: 'The Model Provider',
    alwaysShow: true,
  },
]

const submitItem: QuickPickItem = {
  label: 'Submit',
  description: 'Submit the prompt',
  detail: 'Enter',
  alwaysShow: true,
}

function createLiveEditQP() {
  const qp = window.createQuickPick()
  qp.buttons = [{
    iconPath: new ThemeIcon('gear'),
    tooltip: 'Settings',
  }]
  qp.onDidTriggerButton((e) => {
    if (e.tooltip === 'Settings') {
      openMagicsSettings()
      qp.hide()
    }
  })
  qp.title = `${Meta.displayName} - Live Edit`
  qp.placeholder = 'Input your prompt'
  qp.items = items
  return qp
}

export function liveEdit() {
  const magic: Magic = {
    prompt: '',
    mode: MagicMode.edit,
  }
  const qp = createLiveEditQP()
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
