import { useCommand } from 'reactive-vscode'
import * as Meta from '../generated/meta'
import { openMagicsSettings } from './openSettings'
import { showMagics } from './showMagics'

export function initCommands() {
  useCommand(Meta.commands.showMagics, showMagics)
  useCommand(Meta.commands.magicsSettings, openMagicsSettings)
}
