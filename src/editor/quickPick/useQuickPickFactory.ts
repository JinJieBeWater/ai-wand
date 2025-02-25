import type { QuickInputButton, QuickPick, QuickPickItem } from 'vscode'
import { QuickInputButtons, ThemeIcon, window } from 'vscode'
import * as Meta from '../../generated/meta'
import { openMagicWandConfig, openVscodeSettings } from '../../commands/openSettings'
import { usePrimaryProviderToggle } from './mainMenu/useProviderToggle'

enum ButtonTooltip {
  ProviderToggle = 'Provider Toggle',
  MagicWandConfig = 'AI Wand Config',
  VSCodeSettings = 'vscode Settings',
}

export interface CreateCommonQuickPickOptions<T> {
  stack?: Array<keyof T>
  back?: boolean
  prevValue?: string
  prevSelectedValue?: readonly QuickPickItem[]
}

/**
 * 带有ID的通用QuickPick选项接口
 */
interface CreateCommonQuickPickOptionsWithId<T> extends CreateCommonQuickPickOptions<T> {
  /** 当前QuickPick的唯一标识 */
  id: keyof T
}

/**
 * 创建通用QuickPick的函数类型
 */
type CreateCommonQuickPick<T> = (options: CreateCommonQuickPickOptionsWithId<T>) => {
  /** QuickPick实例 */
  qp: QuickPick<QuickPickItem>
  /** QuickPick导航堆栈 */
  stack: Array<keyof T>
  /** 返回上一级的函数 */
  back: () => void
}


/**
 * QuickPick工厂函数的选项接口
 */
interface CreateQuickPickFactoryOptions<T extends Record<string, QuickPickHandler<T>>> {
  /** QuickPick处理函数映射 */
  qps: T
}


/**
 * QuickPick处理函数类型
 */
type QuickPickHandler<T> = (options: CreateCommonQuickPickOptions<T>) => void

/**
 * 创建QuickPick工厂的函数类型
 */
type CreateQuickPickFactory = <T extends Record<string, QuickPickHandler<T>>>(
  options: CreateQuickPickFactoryOptions<T>
) => CreateCommonQuickPick<T>

const DEFAULT_BUTTONS: QuickInputButton[] = [
  {
    iconPath: new ThemeIcon('copilot'),
    tooltip: ButtonTooltip.ProviderToggle,
  },
  {
    iconPath: new ThemeIcon('json'),
    tooltip: ButtonTooltip.MagicWandConfig,
  },
  {
    iconPath: new ThemeIcon('gear'),
    tooltip: ButtonTooltip.VSCodeSettings,
  },
]

export const useQuickPickFactory: CreateQuickPickFactory = ({ qps }) => {
  return function createCommonQuickPick(options) {
    // 处理堆栈
    const stack = [...(options.stack || []), options.id]
    if (options.back) {
      stack.pop()
    }

    // 创建QuickPick实例
    const qp = window.createQuickPick()
    qp.title = Meta.displayName

    // 设置按钮
    const buttons = [...DEFAULT_BUTTONS]
    if (stack.length > 1) {
      buttons.push(QuickInputButtons.Back)
    }

    qp.buttons = buttons

    // 返回上一级的处理函数
    const back = () => {
      if (stack.length <= 1) {
        return
      }

      stack.pop()

      const targetQp = stack[stack.length - 1]
      if (!targetQp || !qps[targetQp]) {
        console.error('Invalid target quickpick:', targetQp)
        qp.dispose()
        return
      }

      qps[targetQp]({
        stack,
        back: true,
        prevValue: qp.value,
        prevSelectedValue: qp.selectedItems,

      })

      qp.dispose()
    }

    // 按钮点击事件处理
    qp.onDidTriggerButton((button) => {
      switch (button.tooltip) {
        case QuickInputButtons.Back.tooltip:
          back()
          break

        case ButtonTooltip.ProviderToggle:
          usePrimaryProviderToggle()
          break
        case ButtonTooltip.MagicWandConfig:
          openMagicWandConfig()
          break
        case ButtonTooltip.VSCodeSettings:
          openVscodeSettings()
          break
      }
    })

    // 自动清理
    qp.onDidHide(() => {
      qp.dispose()
    })

    return { qp, stack, back }
  }
}
