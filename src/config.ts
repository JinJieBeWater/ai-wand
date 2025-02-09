import { defineConfigObject } from 'reactive-vscode'
import * as Meta from './generated/meta'
import type { Magic } from './types/magic'

export const config = defineConfigObject<Meta.ScopedConfigKeyTypeMap & {
  magics: Record<string, Magic[]>
}>(
  Meta.scopedConfigs.scope,
  Meta.scopedConfigs.defaults as any,
)
