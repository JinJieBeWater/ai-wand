import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModelV1 } from 'ai'
import { window } from 'vscode'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { ProviderOptions, useConfig } from '../configs'

export function getModel(): LanguageModelV1 {
  const config = useConfig()

  const activeProvider = config.value.active.primaryProvider
  const { model, provider } = activeProvider
  const currentProviderConfig = config.value.providers[activeProvider.provider]
  const { apiKey, baseURL } = currentProviderConfig
  switch (provider) {
    case ProviderOptions.openai: {
      const openai = createOpenAI({
        apiKey,
      })
      return openai.chat(model)
    }
    case ProviderOptions.openaiAdaptedServer: {
      const openaiAdaptedServer = createOpenRouter({
        apiKey,
        baseURL,
      })
      return openaiAdaptedServer.chat(model)
    }
    case ProviderOptions.openRouter: {
      const openrouter = createOpenRouter({
        apiKey,
      })
      return openrouter.chat(model)
    }
    case ProviderOptions.deepseek: {
      const deepseek = createDeepSeek({
        apiKey,
      })
      return deepseek.chat(model)
    }
    case ProviderOptions.ollama:
      window.showInformationMessage('ollama is adapting')
      throw new Error('ollama is adapting')
    default:
      window.showErrorMessage('Invalid provider')
      throw new Error('Invalid provider')
  }
}
