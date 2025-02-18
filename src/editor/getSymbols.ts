import type { DocumentSymbol, Uri } from 'vscode'
import { commands } from 'vscode'


/**
 * 获取指定URI的文档符号。
 * @param uri 文档的URI。
 * @returns 文档符号数组，如果获取失败则返回undefined。
 */
export async function getSymbols(uri: Uri): Promise<DocumentSymbol[] | undefined> {
  try {
    const symbols = await commands.executeCommand<DocumentSymbol[]>(
      'vscode.executeDocumentSymbolProvider',
      uri,
    )
    return symbols
  } catch (error) {
    // 记录错误，以便调试
    console.error('Failed to get symbols:', error)
    return undefined
  }
}
