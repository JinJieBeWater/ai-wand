export enum MagicMode {
  edit = 'edit',
  ask = 'ask',
  insert = 'insert',
}

interface MagicContext {
  currentFile?: boolean
  openTabs?: boolean
}

export interface Magic {
  label?: string
  description?: string
  prompt: string
  mode: MagicMode
  context?: MagicContext
}

export interface Magics {
  [key: string]: Magic[]
}
