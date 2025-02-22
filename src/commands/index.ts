import { useCommand } from 'reactive-vscode'
import * as Meta from '../generated/meta'
import type { StatusCodelensProvider } from '../editor/codelens/StatusCodelensProvider'
import { usePrimaryProviderToggle } from '../editor/quickPick/useProviderToggle'
import { showMagics } from './showMagics'
import { openMagicWandConfig, openVscodeSettings } from './openSettings'

export function initCommands() {
  useCommand(Meta.commands.showMagics, showMagics)
  useCommand(Meta.commands.openVscodeSettings, openVscodeSettings)
  useCommand(Meta.commands.openMagicWandConfig, openMagicWandConfig)
  useCommand(Meta.commands.codelensStatusCancel, (that: StatusCodelensProvider) => {
    that.dispose()
  })
  useCommand(Meta.commands.toggleProvider, usePrimaryProviderToggle)
}
