import { APICallError, generateText } from 'ai'
import type { CoreMessage } from 'ai'
import { window } from 'vscode'
import { logger } from '../utils/logger'
import { getModel } from './getModel'

export async function createGenerateText(messages: CoreMessage[]) {
  try {
    const result = await generateText({
      model: getModel(),
      messages,
    })

    // 预防服务器没有响应
    if (result.text === '') {
      window.showErrorMessage('No response from the server')
      throw new Error('No response from the server')
    }

    return result
  }
  catch (error) {
    logger.error(error)
    window.showErrorMessage(JSON.stringify(error))
    throw error
  }
}
