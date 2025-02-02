import type { CoreMessage } from 'ai'
import { window } from 'vscode'

export interface MessageButler {
  addUser: (code: string, prompt: string) => MessageButler
  addAssistant: (msg: string) => MessageButler
  messages: CoreMessage[]
}

export function createMessageButler() {
  const messages: CoreMessage[] = []

  const file_suffix = window.activeTextEditor?.document.fileName.split('.').pop()

  messages.push({
    role: 'system',
    content: `You are a professional programming assistant. When I provide you with a piece of code from a file with the suffix ${file_suffix}, your task is to modify the code by adding or removing specific content according to my requirements. Make sure to strictly adhere to the syntax rules of the programming language corresponding to the ${file_suffix} file. Once the modifications are done, directly return the updated code without enclosing it in Markdown code blocks.`,
  })

  const msgButler: MessageButler = {
    addUser(code: string, prompt: string) {
      messages.push({
        role: 'user',
        content: `My code is as follows: ${code}
My Requirements are as follows: ${prompt}`,
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
