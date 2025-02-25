import { commands, window, workspace } from 'vscode'
import * as Meta from '../generated/meta'
import { configFilePath } from '../configs'

export function openVscodeSettings() {
  commands.executeCommand('workbench.action.openSettings', `${Meta.name}.`)
}

export function openMagicWandConfig() {
  workspace.openTextDocument(configFilePath).then((doc) => {
    window.showTextDocument(doc)
  })
}
