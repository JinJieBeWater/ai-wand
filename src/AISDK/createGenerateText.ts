import { generateText } from 'ai'
import type { CoreMessage } from 'ai'
import { window } from 'vscode'
import { logger } from '../utils/logger'
import { getModel } from './getModel'

export async function createGenerateText(messages: CoreMessage[], options: { abortSignal: AbortSignal }) {
  const abortSignal = options.abortSignal

  try {
    const result = await generateText({
      model: getModel(),
      messages,
      abortSignal,
    })

    // 预防服务器没有响应
    if (result.text === '') {
      window.showErrorMessage('No response from the server')
      throw new Error('No response from the server')
    }

    return result.text
  }
  catch (error: unknown) {
    if (abortSignal.aborted) {
      return ''
    }
    logger.error('createGenerateText', JSON.stringify(error))
    window.showErrorMessage('createGenerateText', JSON.stringify(error))
    throw error
  }
}
