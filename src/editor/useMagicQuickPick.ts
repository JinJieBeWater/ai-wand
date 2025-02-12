import type { QuickPick, QuickPickItem } from 'vscode'
import { QuickPickItemKind, ThemeIcon, window } from 'vscode'
import type { Magic } from '../types/magic'
import { sparkMagic } from '../magic'
import * as Meta from '../generated/meta'
import { openMagicsSettings } from '../commands/openSettings'
import { config } from '../config'
import { liveEdit } from '../magic/liveEdit'
import { useProviderToggle } from './useProviderToggle'

function createMagicQuickPickItemSperator(key: string) {
  return {
    label: key,
    kind: QuickPickItemKind.Separator,
  }
}

function createMagicQuickPickItem(magic: Magic): QuickPickItem {
  return {
    label: magic.label ?? '',
    description: magic.description,
    iconPath: new ThemeIcon('sparkle'),
  }
}

function createMagicQuickPickGrp(key: string, magicGrp: Magic[]): QuickPickItem[] {
  const items: QuickPickItem[] = []
  // 添加分隔符
  items.push(createMagicQuickPickItemSperator(key))
  // 添加magic
  magicGrp.forEach((magic) => {
    items.push(createMagicQuickPickItem(magic))
  })
  return items
}

function createMagicQuickPick() {
  const items: QuickPickItem[] = []
  // 添加临场magic
  items.push({
    label: 'Edit',
    iconPath: new ThemeIcon('zap'),
    description: 'built-in',
    alwaysShow: true,
    picked: true,
  })
  // 组遍历
  Object.entries(config.magics).forEach(([key, magicGrp]) => {
    // 添加magic
    items.push(...createMagicQuickPickGrp(key, magicGrp))
  })
  const qp = window.createQuickPick()
  qp.buttons = [
    {
      iconPath: new ThemeIcon('copilot'),
      tooltip: 'Provider Toggle',
    },
    {
      iconPath: new ThemeIcon('gear'),
      tooltip: 'Settings',
    },
  ]
  qp.onDidTriggerButton((e) => {
    switch (e.tooltip) {
      case 'Provider Toggle':
        useProviderToggle()
        break
      case 'Settings':
        openMagicsSettings()
        break
    }
  })
  qp.title = `${Meta.displayName} SparkMagic`
  qp.placeholder = 'Spark a magic or execute live edit'
  qp.items = items

  qp.onDidHide(() => qp.dispose())

  return qp
}

function onMagicQuickPickAccept(qp: QuickPick<QuickPickItem>) {
  // 获取选中的item
  const item = qp.selectedItems[0]

  switch (item.label) {
    case 'Edit':
      liveEdit(qp.value)
      break
    default: {
      // 构造magic列表
      const magicList: Magic[] = []
      Object.entries(config.magics).forEach(([, magicGrp]) => {
        magicGrp.forEach((magic) => {
          magicList.push(magic)
        })
      })
      const currentMagic = magicList.find(magic => magic.label === item.label)
      if (currentMagic) {
        sparkMagic(currentMagic)
      }
      else {
        window.showErrorMessage('Magic not found')
      }
    }
  }
  qp.hide()
}

function useMagicQuickPick() {
  const qp = createMagicQuickPick()

  qp.onDidAccept(() => onMagicQuickPickAccept(qp))

  return qp
}

export default useMagicQuickPick
