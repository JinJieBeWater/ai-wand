import * as vscode from 'vscode'
import { enableCodeLens } from '../config'
import { getRegex } from '../regex'
import * as Meta from '../generated/meta'

/**
 * CodelensProvider
 */
export class MagicWandCodelensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = []
  private regex: RegExp
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>()
  public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event

  constructor() {
    this.regex = getRegex()

    vscode.workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire()
    })
  }

  public provideCodeLenses(document: vscode.TextDocument, _token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    if (enableCodeLens.value) {
      this.codeLenses = []
      const regex = new RegExp(this.regex)
      const text = document.getText()
      let matches = regex.exec(text)
      while (matches !== null) {
        const line = document.lineAt(document.positionAt(matches.index).line)
        const indexOf = line.text.indexOf(matches[0])
        const position = new vscode.Position(line.lineNumber, indexOf)
        const range = document.getWordRangeAtPosition(position, new RegExp(this.regex))
        if (range) {
          this.codeLenses.push(new vscode.CodeLens(range))
        }
        matches = regex.exec(text)
      }
      return this.codeLenses
    }
    return []
  }

  public resolveCodeLens(codeLens: vscode.CodeLens, _token: vscode.CancellationToken) {
    if (enableCodeLens.value) {
      codeLens.command = {
        title: '🪄',
        tooltip: 'Click to open the Magic Menu',
        command: Meta.commands.quickPickShowMagics,
        arguments: [codeLens.range],
      }
      return codeLens
    }
    return null
  }
}
