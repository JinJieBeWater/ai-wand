import type { DocumentSymbol, Uri } from 'vscode'
import { commands } from 'vscode'

export async function getSymbols(uri: Uri) {
  const symbols = await commands.executeCommand<DocumentSymbol[]>(
    'vscode.executeDocumentSymbolProvider',
    uri,
  )
  return symbols
}
