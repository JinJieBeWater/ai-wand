import type { CoreMessage } from 'ai'
import { generateText } from 'ai'
import { type Selection, window } from 'vscode'
import { StatusCodelensProvider } from '../editor/codelens/StatusCodelensProvider'
import { logger } from '../utils/logger'
import type { Context } from '../magic'
import { getModel } from './getModel'
import { outputParser } from './outputParser'

interface ConnectAISDKOptions {
  context: Context
  messages: CoreMessage[]
  selection: Selection
}

export async function connectAISDK({ context, messages, selection }: ConnectAISDKOptions) {
  const loadingCodelens = new StatusCodelensProvider(selection)

  try {
    const result = await generateText({
      model: getModel(),
      messages,
      abortSignal: loadingCodelens.abortController.signal,
    })
    // 预防服务器没有响应
    if (result.text === '') {
      window.showErrorMessage('No response from the language model')
    }
    else {
      return outputParser(context, result.text)
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
