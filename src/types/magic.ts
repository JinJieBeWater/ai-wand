export enum MagicMode {
  edit = 'edit',
  ask = 'ask',
  insert = 'insert',
}

export enum MagicContextMode {
  currentFile = 'currentFile',
  openTabs = 'openTabs',
}

type MagicContext = {
  [key in MagicContextMode]?: boolean
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
