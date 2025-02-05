import type { CancellationToken, CodeLensProvider, Event, TextDocument } from 'vscode'
import { CodeLens, EventEmitter, Position, workspace } from 'vscode'

import { enableCodeLens } from '../../config'
import { getRegex } from '../../regex'
import * as Meta from '../../generated/meta'

/**
 * CodelensProvider
 */
export class MagicWandCodelensProvider implements CodeLensProvider {
  private codeLenses: CodeLens[] = []
  private regex: RegExp
  private _onDidChangeCodeLenses: EventEmitter<void> = new EventEmitter<void>()
  public readonly onDidChangeCodeLenses: Event<void> = this._onDidChangeCodeLenses.event

  constructor() {
    this.regex = getRegex()

    workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire()
    })
  }

  public provideCodeLenses(document: TextDocument, _token: CancellationToken): CodeLens[] | Thenable<CodeLens[]> {
    if (enableCodeLens.value) {
      this.codeLenses = []
      const regex = new RegExp(this.regex)
      const text = document.getText()
      let matches = regex.exec(text)
      while (matches !== null) {
        const line = document.lineAt(document.positionAt(matches.index).line)
        const indexOf = line.text.indexOf(matches[0])
        const position = new Position(line.lineNumber, indexOf)
        const range = document.getWordRangeAtPosition(position, new RegExp(this.regex))
        if (range) {
          this.codeLenses.push(new CodeLens(range))
        }
        matches = regex.exec(text)
      }
      return this.codeLenses
    }
    return []
  }

  public resolveCodeLens(codeLens: CodeLens, _token: CancellationToken) {
    if (enableCodeLens.value) {
      codeLens.command = {
        title: '🪄',
        tooltip: 'Click to open the Magic Menu',
        command: Meta.commands.showMagics,
        arguments: [codeLens.range.start.line],
      }
      return codeLens
    }
    return null
  }
}
