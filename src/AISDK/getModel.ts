import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import type { LanguageModelV1 } from 'ai'
import { window } from 'vscode'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { config } from '../config'

export function getModel(): LanguageModelV1 {
  switch (config['status.activeProvider']) {
    case 'openRouter': {
      const openrouter = createOpenRouter({
        apiKey: config['provider.openRouterApiKey'],
      })
      return openrouter.chat(config['provider.openRouterModel'])
    }
    case 'deepseek': {
      const deepseek = createDeepSeek({
        apiKey: config['provider.deepseekApiKey'],
      })
      return deepseek.chat(config['provider.deepseekModel'])
    }
    case 'ollama':
      window.showInformationMessage('ollama is adapting')
      throw new Error('ollama is adapting')
    default:
      window.showErrorMessage('Invalid provider')
      throw new Error('Invalid provider')
  }
}
