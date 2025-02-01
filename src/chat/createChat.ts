import type { CoreMessage, StreamTextResult, ToolSet } from 'ai'
import { TypeValidationError, streamText } from 'ai'
import { window } from 'vscode'
import { getModel } from './getModel'

export function createChat(messages: CoreMessage[]) {
  try {
    // 用于存储完整的响应
    const result = streamText({
      model: getModel(),
      messages,
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
