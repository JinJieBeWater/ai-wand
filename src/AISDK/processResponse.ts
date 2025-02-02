import type { FinishReason, LanguageModelUsage } from 'ai'
import { window } from 'vscode'
import { logger } from '../utils/logger'

export function processUsage(usage: LanguageModelUsage) {
  logger.info('promptTokens', usage.promptTokens)
  logger.info('completionTokens', usage.completionTokens)
  logger.info('totalTokens', usage.totalTokens)
}

export function processFinishReason(finishReason: FinishReason) {
  switch (finishReason) {
    case 'stop':
      break
    case 'length':
      window.showErrorMessage('model generated maximum number of tokens')
      break
    case 'content-filter':
      window.showErrorMessage('content filter violation stopped the model')
      break
    case 'tool-calls':
      break
    case 'error':
      window.showErrorMessage('model stopped because of an error')
      break
    case 'other':
      window.showErrorMessage('model stopped for other reasons')
      break
    case 'unknown':
      window.showErrorMessage('Unknown finish reason')
      break
  }
}
