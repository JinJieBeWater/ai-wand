export enum MagicMode {
  edit,
  ask,
  insert,
}
export interface Magic {
  description: string
  prompt: string
  mode: MagicMode
}

export interface MagicGrp {
  [key: string]: Magic
}

export interface Magics {
  [key: string]: MagicGrp
}
