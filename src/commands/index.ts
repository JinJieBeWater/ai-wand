import { useCommand } from 'reactive-vscode'
import * as Meta from '../generated/meta'
import type { StatusCodelensProvider } from '../editor/codelens/StatusCodelensProvider'
import { useProviderToggle } from '../editor/useProviderToggle'
import { openMagicsSettings } from './openSettings'
import { showMagics } from './showMagics'

export function initCommands() {
  useCommand(Meta.commands.showMagics, showMagics)
  useCommand(Meta.commands.magicsSettings, openMagicsSettings)
  useCommand(Meta.commands.codelensStatusCancel, (that: StatusCodelensProvider) => {
    that.dispose()
  })
  useCommand(Meta.commands.toggleProvider, useProviderToggle)
}
