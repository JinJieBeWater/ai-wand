import type { CoreMessage, FinishReason, LanguageModelUsage, StreamTextResult, ToolSet } from 'ai'
import { TypeValidationError, smoothStream, streamText } from 'ai'
import { window } from 'vscode'
import { logger } from '../utils/logger'
import { getModel } from './getModel'
import { processFinishReason, processUsage } from './processResponse'

export interface CreateStreamTextProps {
  messages: CoreMessage[]
  onTextDelta?: (delta: string) => void
  onFinish?: (text: string, finishReason: FinishReason, usage: LanguageModelUsage) => void
}

export function createStreamText({ messages, onTextDelta, onFinish }: CreateStreamTextProps) {
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
            onTextDelta?.(chunk.textDelta)
            break
          case 'reasoning':
            logger.info('reasoning', chunk.textDelta)
            break
        }
      },
      onFinish: ({ text, finishReason, usage }) => {
        processFinishReason(finishReason)
        processUsage(usage)
        onFinish?.(text, finishReason, usage)
      },
    })
    return result
  }
  catch (error) {
    logger.error('createStreamText', JSON.stringify(error))
    window.showErrorMessage('createStreamText', JSON.stringify(error))
    throw error
  }
}
