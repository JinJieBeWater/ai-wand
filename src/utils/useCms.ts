import { useCommands } from 'reactive-vscode'
import type { CommandKey } from '../generated/meta'

type CMSItem = Record<CommandKey, (...args: any[]) => any>

export function useCms(cms: CMSItem) {
  useCommands(cms)
}
