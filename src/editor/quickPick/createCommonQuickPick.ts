import type { QuickInputButton } from 'vscode'
import { QuickInputButtons, QuickPick, QuickPickItem, ThemeIcon, window } from 'vscode'
import * as Meta from '../../generated/meta'
import { openMagicWandConfig, openVscodeSettings } from '../../commands/openSettings'
import { liveEdit } from '../../magic/liveEdit'
import { logger } from '../../utils/logger'
import { ProviderToggleMode, useProviderToggle } from './useProviderToggle'
import useMagicQuickPick from './useMagicQuickPick'

enum ButtonTooltip {
  ProviderToggle = 'Provider Toggle',
  MagicWandConfig = 'Magic Wand Config',
  VSCodeSettings = 'vscode Settings',
}

export enum QuickPickId {
  useMagicQuickPick,
  useProviderToggle,
  liveEdit,
}

export interface CreateQuickPickOptions {
  stack?: QuickPickId[]
  back?: boolean
}

export function createCommonQuickPick(options: CreateQuickPickOptions & {
  id: QuickPickId
}) {
  const stack = options.stack ? [...options.stack, options.id] : [options.id]

  if (options.back) {
    stack.pop()
  }

  logger.info(stack.length)

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

  qp.onDidTriggerButton((e) => {
    switch (e.tooltip) {
      case QuickInputButtons.Back.tooltip: {
        stack.pop()
        qp.dispose()
        switch (stack[stack.length - 1]) {
          case QuickPickId.useProviderToggle:
            useProviderToggle(ProviderToggleMode.primaryProvider, {
              stack,
              back: true,
            })
            break
          case QuickPickId.liveEdit:
            liveEdit('', {
              stack,
              back: true,
            })
            break
          case QuickPickId.useMagicQuickPick:
            useMagicQuickPick({
              stack,
              back: true,
            })
            break
        }
        break
      }
      case ButtonTooltip.ProviderToggle:
        useProviderToggle(ProviderToggleMode.primaryProvider, {
          stack,
        })
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

  return { qp, stack }
}
