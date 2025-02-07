import { useCommand } from 'reactive-vscode'
import { window } from 'vscode'
import * as Meta from '../generated/meta'
import type { StatusCodelensProvider } from '../editor/codelens/StatusCodelensProvider'
import { config } from '../config'
import { openMagicsSettings } from './openSettings'
import { showMagics } from './showMagics'

export function initCommands() {
  useCommand(Meta.commands.showMagics, showMagics)
  useCommand(Meta.commands.magicsSettings, openMagicsSettings)
  useCommand(Meta.commands.codelensStatusCancel, (that: StatusCodelensProvider) => {
    that.dispose()
  })
  useCommand(Meta.commands.toggleProvider, async () => {
    const providers: Meta.ConfigKeyTypeMap['magic-wand.status.activeProvider'][] = [
      'openRouter',
      'ollama',
      'deepseek',
    ]
    const selected = await window.showQuickPick(providers, {
      placeHolder: '选择 AI 提供商',
    })

    if (selected) {
      config.$set('status.activeProvider', selected)
      await window.showInformationMessage(`切换到 ${config['status.activeProvider']} 提供商`)
    }
  })
}
