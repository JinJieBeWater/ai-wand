import { ThemeIcon, window } from 'vscode'
import * as Meta from '../../generated/meta'
import { openMagicWandConfig, openVscodeSettings } from '../../commands/openSettings'
import { useProviderToggle } from './useProviderToggle'

enum ButtonTooltip {
  ProviderToggle = 'Provider Toggle',
  MagicWandConfig = 'Magic Wand Config',
  VSCodeSettings = 'vscode Settings',
}

export function createCommonQuickPick() {
  const qp = window.createQuickPick()
  qp.title = Meta.displayName
  qp.buttons = [
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
  qp.onDidTriggerButton((e) => {
    switch (e.tooltip) {
      case ButtonTooltip.ProviderToggle:
        useProviderToggle()
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

  return qp
}
