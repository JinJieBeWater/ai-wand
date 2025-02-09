import type { CoreMessage } from 'ai'
import { generateText } from 'ai'
import { type Selection, window } from 'vscode'
import { StatusCodelensProvider } from '../editor/codelens/StatusCodelensProvider'
import { logger } from '../utils/logger'
import { getModel } from './getModel'
import { outputParser } from './outputParser'

export async function connectAISDK({ messages, selection }: { messages: CoreMessage[], selection: Selection }) {
  const loadingCodelens = new StatusCodelensProvider(selection)

  try {
    const result = await generateText({
      model: getModel(),
      messages,
      abortSignal: loadingCodelens.abortController.signal,
    })
    // 预防服务器没有响应
    if (result.text === '') {
      window.showErrorMessage('No response from the server')
    }
    else {
      return outputParser(result.text)
    }
  }
  catch (error) {
    if (!loadingCodelens.abortController.signal.aborted) {
      window.showErrorMessage('createGenerateText', JSON.stringify(error))
      logger.error('createGenerateText', JSON.stringify(error))
      throw error
    }
  }
  finally {
    loadingCodelens.dispose()
  }
}
