import type { QuickPick, QuickPickItem } from 'vscode'
import { QuickPickItemKind, ThemeIcon, window } from 'vscode'
import type { Magic } from '../../types/magic'
import { sparkMagic } from '../../magic'
import { liveEdit } from '../../magic/liveEdit'
import { useConfig } from '../../configs'
import type { CreateQuickPickOptions } from './createCommonQuickPick'
import { QuickPickId, createCommonQuickPick } from './createCommonQuickPick'

const config = useConfig()

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

function createMagicQuickPick(options?: CreateQuickPickOptions) {
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
  Object.entries(config.value.magics).forEach(([key, magicGrp]) => {
    // 添加magic
    items.push(...createMagicQuickPickGrp(key, magicGrp))
  })
  const { qp, stack } = createCommonQuickPick({
    id: QuickPickId.useMagicQuickPick,
    ...options,
  })
  qp.title = `${qp.title} SparkMagic`
  qp.placeholder = 'Spark a magic or execute live edit'
  qp.items = items

  return { qp, stack }
}

function onMagicQuickPickAccept(qp: QuickPick<QuickPickItem>, options?: CreateQuickPickOptions) {
  // 获取选中的item
  const item = qp.selectedItems[0]

  switch (item.label) {
    case 'Edit':
      liveEdit(qp.value, {
        stack: options?.stack,
      })
      break
    default: {
      // 构造magic列表
      const magicList: Magic[] = []
      Object.entries(config.value.magics).forEach(([, magicGrp]) => {
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

function useMagicQuickPick(options?: CreateQuickPickOptions) {
  const { qp, stack } = createMagicQuickPick(options)

  qp.onDidAccept(() => onMagicQuickPickAccept(qp, {
    stack,
  }))
  qp.show()
  return qp
}

export default useMagicQuickPick
