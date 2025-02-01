import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import type { CoreMessage, LanguageModelV1, StreamTextResult, ToolSet } from 'ai'
import { streamText } from 'ai'
import { window } from 'vscode'
import { activeProvider, openRouterApiKey, openRouterModel } from '../config'

export function createChat(messages: CoreMessage[]): StreamTextResult<ToolSet, never> {
  return streamText({
    model: getModel(),
    messages,
  })
}

function getModel(): LanguageModelV1 {
  switch (activeProvider.value) {
    case 'openRouter': {
      const openrouter = createOpenRouter({
        apiKey: openRouterApiKey.value,
      })
      return openrouter.chat(openRouterModel.value)
    }
    case 'ollama':
      window.showInformationMessage('ollama is adapting')
      throw new Error('ollama is adapting')
    default:
      window.showErrorMessage('Invalid provider')
      throw new Error('Invalid provider')
  }
}
