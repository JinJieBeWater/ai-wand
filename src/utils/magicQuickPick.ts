import type { QuickPick, QuickPickItem } from 'vscode'
import { QuickPickItemKind, ThemeIcon, window } from 'vscode'
import { magics } from '../config'
import { displayName } from '../generated/meta'
import type { MagicGrp } from '../types/magic'
import { logger } from './logger'

function createMagicQuickPickItemSperator(key: string) {
  return {
    label: key,
    kind: QuickPickItemKind.Separator,
  }
}

function createMagicQuickPickItem(key: string, magic: any): QuickPickItem {
  return {
    label: key,
    description: magic.description,
    iconPath: new ThemeIcon('sparkle'),
  }
}

function createMagicQuickPickGrp(key: string, magicGrp: MagicGrp): QuickPickItem[] {
  const items: QuickPickItem[] = []
  // 添加分隔符
  items.push(createMagicQuickPickItemSperator(key))
  // 添加magic
  Object.entries(magicGrp).forEach(([key, magic]) => {
    items.push(createMagicQuickPickItem(key, magic))
  })
  return items
}

function createMagicQuickPickCustomize(): QuickPickItem {
  return {
    label: 'Customize',
    description: 'Jump to the magic settings',
    iconPath: new ThemeIcon('gear'),
  }
}

function onMagicQuickPickAccept(qp: QuickPick<QuickPickItem>) {
  const item = qp.selectedItems[0]
  if (item.label === 'Customize') {
    logger.info('Customize new magic')
  }
  else {
    logger.info(`Spark a magic: ${item.label}`)
  }
  qp.hide()
}

function createMagicQuickPick() {
  const items: QuickPickItem[] = []
  // 组遍历
  Object.entries(magics.value).forEach(([key, magicGrp]) => {
    // 添加magic
    items.push(...createMagicQuickPickGrp(key, magicGrp))
  })
  // 添加自定义按钮
  items.push(createMagicQuickPickCustomize())
  const qp = window.createQuickPick()
  qp.title = displayName
  qp.placeholder = 'Spark a magic or customize new magic'
  qp.items = items
  qp.onDidAccept(() => onMagicQuickPickAccept(qp))
  return qp
}

function useMagicQuickPick() {
  const qp = createMagicQuickPick()
  return qp
}

export default useMagicQuickPick
