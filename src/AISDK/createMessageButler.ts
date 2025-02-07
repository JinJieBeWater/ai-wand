import type { CoreMessage } from 'ai'
import { window } from 'vscode'
import { SystemPrompt, UserPrompt } from './prompt'

export interface MessageButler {
  addUser: (code: string, prompt: string) => MessageButler
  addAssistant: (msg: string) => MessageButler
  messages: CoreMessage[]
}

export function createMessageButler() {
  const messages: CoreMessage[] = []

  messages.push({
    role: 'system',
    content: SystemPrompt(),
  })

  const msgButler: MessageButler = {
    addUser(code: string, prompt: string) {
      const language = window.activeTextEditor?.document.fileName.split('.').pop()

      messages.push({
        role: 'user',
        content: UserPrompt(code, prompt, language),
      })
      return msgButler
    },
    addAssistant(msg: string) {
      messages.push({
        role: 'assistant',
        content: msg,
      })
      return msgButler
    },
    messages,
  }
  return msgButler
}
