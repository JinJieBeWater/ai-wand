import { ollama } from 'ollama-ai-provider'
import type { CoreMessage, LanguageModelV1 } from 'ai'
import { TypeValidationError, streamText } from 'ai'
import { window } from 'vscode'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import type { Magic } from '../types/magic'
import { activeProvider, openRouterApiKey, openRouterModel } from '../config'
import { logger } from './logger'

export async function sparkMagic(magic: Magic) {
  const editor = window.activeTextEditor

  const file_suffix = editor?.document.fileName.split('.').pop()

  const selection = editor?.selection
  const code = editor?.document.getText(selection)

  const openrouter = createOpenRouter({
    apiKey: openRouterApiKey.value,
  })

  logger.info('openrouter', openRouterApiKey.value)

  if (!code) {
    window.showErrorMessage('No target code selected')
    return
  }

  const messages: CoreMessage[] = []

  messages.push({
    role: 'system',
    content: `You are a professional programming assistant. When I provide you with a piece of code from a file with the suffix ${file_suffix}, your task is to modify the code by adding or removing specific content according to my requirements. Make sure to strictly adhere to the syntax rules of the programming language corresponding to the ${file_suffix} file. Once the modifications are done, directly return the updated code without enclosing it in Markdown code blocks.`,
  })

  messages.push({
    role: 'user',
    content: `
    My code is as follows: ${code}
    My Requirements are as follows: ${magic.prompt}
    `,
  })

  logger.info('Start to spark magic')
  try {
    let model: LanguageModelV1

    switch (activeProvider.value) {
      case 'openRouter':
        model = openrouter.chat(openRouterModel.value)
        break
      case 'ollama':
        window.showInformationMessage('ollama is adapting')
        throw new Error('ollama is adapting')
        break
      default:
        window.showErrorMessage('Invalid provider')
        throw new Error('Invalid provider')
    }

    const result = streamText({
      model,
      messages,
    })

    let fullResponse = ''

    for await (const delta of result.textStream) {
      fullResponse += delta
      // TODO: 替换掉用户选择的内容 使用delta 流式替换
      logger.append(`${delta}`)
    }

    if (fullResponse === '') {
      window.showErrorMessage('No response from the server')
      return
    }

    if (selection) {
      editor?.edit((editBuilder) => {
        editBuilder.replace(selection, fullResponse)
        editor?.revealRange(selection)
      })
    }

    messages.push({
      role: 'assistant',
      content: fullResponse,
    })
  }
  catch (error) {
    if (TypeValidationError.isInstance(error)) {
      logger.info(error)
      window.showErrorMessage('Type validation fails. Maybe Server is not working')
    }
  }
}
