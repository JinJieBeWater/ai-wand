import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModelV1 } from 'ai'
import { window } from 'vscode'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { settings } from '../configs/settings'

export function getModel(): LanguageModelV1 {
  switch (settings['status.activeProvider']) {
    case 'openai': {
      const openai = createOpenAI({
        apiKey: settings['provider.openaiApiKey'],
      })
      return openai.chat(settings['provider.openaiModel'])
    }
    case 'openaiAdaptedServer': {
      const openaiAdaptedServer = createOpenRouter({
        apiKey: settings['provider.openaiAdaptedServerApiKey'],
        baseURL: settings['provider.openaiAdaptedServerUrl'],
      })
      return openaiAdaptedServer.chat(settings['provider.openaiAdaptedServerModel'])
    }
    case 'openRouter': {
      const openrouter = createOpenRouter({
        apiKey: settings['provider.openRouterApiKey'],
      })
      return openrouter.chat(settings['provider.openRouterModel'])
    }
    case 'deepseek': {
      const deepseek = createDeepSeek({
        apiKey: settings['provider.deepseekApiKey'],
      })
      return deepseek.chat(settings['provider.deepseekModel'])
    }
    case 'ollama':
      window.showInformationMessage('ollama is adapting')
      throw new Error('ollama is adapting')
    default:
      window.showErrorMessage('Invalid provider')
      throw new Error('Invalid provider')
  }
}
