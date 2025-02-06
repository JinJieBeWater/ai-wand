import type { CancellationToken, CodeLensProvider, Disposable, Event, Range, TextDocument } from 'vscode'
import { CodeLens, EventEmitter, languages, workspace } from 'vscode'

import { useCommand, useDisposable } from 'reactive-vscode'
import { enableCodeLens } from '../../config'
import * as Meta from '../../generated/meta'
import { showMagics } from '../../commands/showMagics'
import { selectAiLine } from '../selectAiLine'
import { logger } from '../../utils/logger'

/**
 * CodelensProvider
 */
export class LoadingCodelensProvider implements CodeLensProvider {
  private _disposables: Disposable[] = []
  private _onDidChangeCodeLenses: EventEmitter<void> = new EventEmitter<void>()
  public readonly onDidChangeCodeLenses: Event<void> = this._onDidChangeCodeLenses.event
  public loadingCodelen: CodeLens
  public cancelCodelen: CodeLens
  public abortController: AbortController

  constructor(range: Range, abortController: AbortController) {
    const loadingCodelen = new CodeLens(range)
    loadingCodelen.command = {
      title: '$(sync~spin) Loading',
      tooltip: 'Requesting - Magic is being released',
      command: Meta.commands.codelensClick,
      arguments: [loadingCodelen],
    }
    this.loadingCodelen = loadingCodelen

    const cancelCodelen = new CodeLens(range)
    cancelCodelen.command = {
      title: 'Cancel',
      tooltip: 'Cancel Magic Wand',
      command: Meta.commands.codelensClick,
      arguments: [cancelCodelen],
    }
    this.cancelCodelen = cancelCodelen

    this.abortController = abortController

    workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire()
    })

    this.init()
  }

  /**
   * init
   */
  private init(): void {
    this._disposables.push(useDisposable(languages.registerCodeLensProvider({ scheme: 'file' }, this)))
    // useCommand(Meta.commands.codelensClick, (lens: CodeLens) => {
    //   selectAiLine(lens.range.start.line)
    //   showMagics()
    //   this.fire()
    // })
  }

  public provideCodeLenses(_document: TextDocument, _token: CancellationToken): CodeLens[] | Thenable<CodeLens[]> {
    logger.info('LoadingCodelensProviderprovideCodeLenses')
    const codeLenses: CodeLens[] = []
    codeLenses.push(this.loadingCodelen)
    codeLenses.push(this.cancelCodelen)

    return codeLenses
  }

  public resolveCodeLens(codeLens: CodeLens, _token: CancellationToken) {
    logger.info('resolveCodeLens', codeLens.range.start.line)
    return null
  }

  public fire(): void {
    if (enableCodeLens.value) {
      this._onDidChangeCodeLenses.fire()
    }
  }

  public abort() {
    this.abortController.abort()
  }

  public dispose() {
    this.abort()
    this._disposables.forEach(d => d.dispose())
  }
}
