import type { QuickInputButton, QuickPick, QuickPickItem } from 'vscode'
import { QuickInputButtons, ThemeIcon, window } from 'vscode'
import * as Meta from '../../generated/meta'
import { openMagicWandConfig, openVscodeSettings } from '../../commands/openSettings'
import { liveEdit } from '../../magic/liveEdit'
import { ProviderToggleMode, useProviderToggle } from './useProviderToggle'
import useMagicQuickPick from './useMagicQuickPick'
import { useEditContextQuickPick } from './useEditContextQuickPick'

enum ButtonTooltip {
  ProviderToggle = 'Provider Toggle',
  MagicWandConfig = 'Magic Wand Config',
  VSCodeSettings = 'vscode Settings',
}

export enum QuickPickId {
  magic,
  providerToggle,
  liveEdit,
  editContext,
}

export interface CreateQuickPickOptions {
  stack?: QuickPickId[]
  back?: boolean
  preValue?: readonly QuickPickItem[]
}

type QP = QuickPick<QuickPickItem> & {
  id: QuickPickId
}
export function createCommonQuickPick(options: CreateQuickPickOptions & {
  id: QuickPickId
}) {
  const stack = options.stack ? [...options.stack, options.id] : [options.id]

  if (options.back) {
    stack.pop()
  }

  const qp = window.createQuickPick() as QP
  qp.title = Meta.displayName
  qp.id = options.id
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

  const back = (preValue: readonly QuickPickItem[] = []) => {
    stack.pop()
    const options: CreateQuickPickOptions = {
      stack,
      back: true,
      preValue,
    }

    switch (stack[stack.length - 1]) {
      case QuickPickId.providerToggle:
        useProviderToggle(ProviderToggleMode.primaryProvider, {
          ...options,
        })
        break
      case QuickPickId.liveEdit:
        liveEdit('', {
          ...options,
        })
        break
      case QuickPickId.magic:
        useMagicQuickPick({
          ...options,
        })
        break
      case QuickPickId.editContext:
        useEditContextQuickPick({
          ...options,
        })
    }
    qp.dispose()
  }

  qp.onDidTriggerButton((e) => {
    switch (e.tooltip) {
      case QuickInputButtons.Back.tooltip: {
        back()
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

  return { qp, stack, back }
}
