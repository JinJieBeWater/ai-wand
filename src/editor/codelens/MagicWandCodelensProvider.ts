import type { CancellationToken, CodeLensProvider, Disposable, Event, TextDocument } from 'vscode'
import { CodeLens, EventEmitter, Position, commands, languages, workspace } from 'vscode'

import { useCommand, useDisposable } from 'reactive-vscode'
import { getRegex } from '../../regex'
import * as Meta from '../../generated/meta'
import { selectAiLine } from '../selectAiLine'
import { logger } from '../../utils/logger'
import { config } from '../../config'

/**
 * CodelensProvider
 */
export class MagicWandCodelensProvider implements CodeLensProvider {
  private regex: RegExp
  private _disposables: Disposable[] = []
  private _onDidChangeCodeLenses: EventEmitter<void> = new EventEmitter<void>()
  public readonly onDidChangeCodeLenses: Event<void> = this._onDidChangeCodeLenses.event
  public activeCodeLens: Map<number, CodeLens> = new Map()

  constructor() {
    this.regex = getRegex()

    this.init()

    workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire()
    })
  }

  /**
   * init
   */
  private init(): void {
    this._disposables.push(useDisposable(languages.registerCodeLensProvider({ scheme: 'file' }, this)))
    useCommand(Meta.commands.codelensClick, (lens: CodeLens) => {
      selectAiLine(lens.range.start.line)
      commands.executeCommand(Meta.commands.showMagics)
      this.fire()
    })
  }

  public provideCodeLenses(document: TextDocument, _token: CancellationToken): CodeLens[] | Thenable<CodeLens[]> {
    const codeLenses: CodeLens[] = []
    if (config['status.enableCodeLens']) {
      const regex = new RegExp(this.regex)
      const text = document.getText()
      let matches = regex.exec(text)
      while (matches !== null) {
        const line = document.lineAt(document.positionAt(matches.index).line)
        const indexOf = line.text.indexOf(matches[0])
        const position = new Position(line.lineNumber, indexOf)
        const range = document.getWordRangeAtPosition(position, new RegExp(this.regex))

        if (range) {
          const codeLens = new CodeLens(range)
          const activeCodelen = this.activeCodeLens.get(range.start.line)
          if (activeCodelen) {
            codeLens.command = activeCodelen.command
          }
          else {
            codeLens.command = {
              title: '🪄',
              tooltip: 'Magic Wand Show Magics',
              command: Meta.commands.codelensClick,
              arguments: [codeLens],
            }
          }
          codeLenses.push(codeLens)
        }
        matches = regex.exec(text)
      }
      return codeLenses
    }
    return []
  }

  public resolveCodeLens(codeLens: CodeLens, _token: CancellationToken) {
    logger.info('resolveCodeLens', codeLens.range.start.line)
    return null
  }

  public fire(): void {
    if (config['status.enableCodeLens']) {
      this._onDidChangeCodeLenses.fire()
    }
  }
}
