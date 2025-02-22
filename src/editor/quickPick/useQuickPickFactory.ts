import type { QuickInputButton, QuickPick, QuickPickItem } from 'vscode'
import { QuickInputButtons, ThemeIcon, window } from 'vscode'
import * as Meta from '../../generated/meta'
import { openMagicWandConfig, openVscodeSettings } from '../../commands/openSettings'
import { usePrimaryProviderToggle } from './useProviderToggle'

enum ButtonTooltip {
  ProviderToggle = 'Provider Toggle',
  MagicWandConfig = 'Magic Wand Config',
  VSCodeSettings = 'vscode Settings',
}

export interface CreateCommonQuickPickOptions<T> {
  stack?: Array<keyof T>
  back?: boolean
  prevValue?: string
  prevSelectedValue?: readonly QuickPickItem[]
}

interface CreateCommonQuickPickOptionsWithId<T> extends CreateCommonQuickPickOptions<T> {
  id: keyof T
}

type CreateCommonQuickPick<T> = (options: CreateCommonQuickPickOptionsWithId<T>) => {
  qp: QuickPick<QuickPickItem>
  stack: Array<keyof T>
  back: () => void
}

interface CreateQuickPickFactoryOptions<T> {
  qps: T
}

type CreateQuickPickFactory = <T extends { [K: string]: (options: CreateCommonQuickPickOptions<T>) => void }>(
  options: CreateQuickPickFactoryOptions<T>
) => CreateCommonQuickPick<T>

export const useQuickPickFactory: CreateQuickPickFactory = ({ qps }) => {
  return function createCommonQuickPick(options) {
    const stack = options.stack ? [...options.stack, options.id] : [options.id]

    if (options.back) {
      stack.pop()
    }

    const qp = window.createQuickPick()
    qp.title = Meta.displayName
    const buttons: QuickInputButton[] = [
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

    if (stack.length > 1) {
      buttons.push(QuickInputButtons.Back)
    }

    qp.buttons = buttons

    const back = () => {
      stack.pop()
      const options = {
        stack,
        back: true,
        prevValue: qp.value,
        prevSelectedValue: qp.selectedItems,
      }
      const targeQp = stack[stack.length - 1]
      qps[targeQp]({
        ...options,
      })

      qp.dispose()
    }

    qp.onDidTriggerButton((e) => {
      switch (e.tooltip) {
        case QuickInputButtons.Back.tooltip: {
          back()
          break
        }
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

    qp.onDidHide(() => qp.dispose())

    return { qp, stack, back }
  }
}
