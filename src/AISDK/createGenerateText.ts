import { APICallError, generateText } from 'ai'
import type { CoreMessage } from 'ai'
import { window } from 'vscode'
import { logger } from '../utils/logger'
import { getModel } from './getModel'

export function createGenerateText(messages: CoreMessage[]) {
  try {
    const result = generateText({
      model: getModel(),
      messages,
    })
    return result
  }
  catch (error) {
    logger.error(error)
    window.showErrorMessage(JSON.stringify(error))
    throw error
  }
}
