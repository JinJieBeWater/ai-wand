import type { CoreMessage } from 'ai'
import type { Context } from '../magic'
import { SystemPrompt, UserPrompt } from './prompt'

export interface MessageButler {
  addUser: (code: string, prompt: string) => MessageButler
  addAssistant: (msg: string) => MessageButler
  messages: CoreMessage[]
}

export function createMessageButler(context: Context) {
  const messages: CoreMessage[] = []

  messages.push({
    role: 'system',
    content: SystemPrompt(context),
  })

  const msgButler: MessageButler = {
    addUser(code: string, prompt: string) {
      messages.push({
        role: 'user',
        content: UserPrompt(context, code, prompt),
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
