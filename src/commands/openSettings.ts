import { commands } from 'vscode'
import * as Meta from '../generated/meta'

export function openMagicsSettings() {
  commands.executeCommand('workbench.action.openSettings', `${Meta.name}.magics`)
}
