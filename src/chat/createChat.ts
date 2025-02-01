import type { CoreMessage, FinishReason, LanguageModelUsage, StreamTextResult, ToolSet } from 'ai'
import { TypeValidationError, smoothStream, streamText } from 'ai'
import { window } from 'vscode'
import { logger } from '../utils/logger'
import { getModel } from './getModel'

export function createStreamText(messages: CoreMessage[]) {
  try {
    // 用于存储完整的响应
    const result = streamText({
      model: getModel(),
      messages,
      experimental_transform: smoothStream({
        delayInMs: 20,
        chunking: 'line',
      }),
      onChunk: ({ chunk }) => {
        switch (chunk.type) {
          case 'text-delta':
            logger.info('text', chunk.textDelta)
            break
          case 'reasoning':
            logger.info('reasoning', chunk.textDelta)
            break
        }
      },
      onFinish: ({ text, finishReason, usage }) => {
        logger.info('finish', text)
        processFinishReason(finishReason)
        processUsage(usage)
      },
    })
    return result
  }
  catch (error) {
    if (TypeValidationError.isInstance(error)) {
      window.showErrorMessage('Type validation fails. Maybe Server is not working')
      throw error
    }
  }
}

function processUsage(usage: LanguageModelUsage) {
  logger.info('promptTokens', usage.promptTokens)
  logger.info('completionTokens', usage.completionTokens)
  logger.info('totalTokens', usage.totalTokens)
}

function processFinishReason(finishReason: FinishReason) {
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
