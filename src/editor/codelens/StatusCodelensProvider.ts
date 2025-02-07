import type { CancellationToken, CodeLensProvider, Disposable, Event, Range, TextDocument } from 'vscode'
import { CodeLens, EventEmitter, languages, workspace } from 'vscode'

import * as Meta from '../../generated/meta'
import { logger } from '../../utils/logger'

/**
 * CodelensProvider
 */
export class StatusCodelensProvider implements CodeLensProvider {
  private _disposables: Disposable[] = []
  private _onDidChangeCodeLenses: EventEmitter<void> = new EventEmitter<void>()
  public readonly onDidChangeCodeLenses: Event<void> = this._onDidChangeCodeLenses.event
  public loadingCodelen: CodeLens
  public cancelCodelen: CodeLens
  public abortController: AbortController = new AbortController()

  constructor(range: Range) {
    const loadingCodelen = new CodeLens(range)
    loadingCodelen.command = {
      title: '$(sync~spin) Loading',
      tooltip: 'Requesting - Magic is being released',
      command: '',
    }
    this.loadingCodelen = loadingCodelen

    const cancelCodelen = new CodeLens(range)
    cancelCodelen.command = {
      title: 'Cancel',
      tooltip: 'Cancel Magic Wand',
      command: Meta.commands.codelensStatusCancel,
      arguments: [this],
    }
    this.cancelCodelen = cancelCodelen

    workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire()
    })

    this.init()
  }

  /**
   * init
   */
  private init(): void {
    this._disposables.push(languages.registerCodeLensProvider({ scheme: 'file' }, this))
  }

  public provideCodeLenses(_document: TextDocument, _token: CancellationToken): CodeLens[] | Thenable<CodeLens[]> {
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
    this._onDidChangeCodeLenses.fire()
  }

  public dispose() {
    this.abortController.abort()
    this._disposables.forEach(d => d.dispose())
    this.fire()
  }
}
