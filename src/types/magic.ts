export enum MagicMode {
  edit,
  ask,
  insert,
}
export interface Magic {
  label: string
  description: string
  prompt: string
  mode: MagicMode
}

export interface Magics {
  [key: string]: Magic[]
}
