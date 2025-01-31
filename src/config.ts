import type { ConfigType } from 'reactive-vscode'
import { defineConfigObject, defineConfigs } from 'reactive-vscode'
import * as Meta from './generated/meta'
import type { Magics } from './types/magic'

export const config = defineConfigObject<Meta.ScopedConfigKeyTypeMap>(
  Meta.scopedConfigs.scope,
  Meta.scopedConfigs.defaults,
)

export const { magics, 'provider.openRouterApiKey': openRouterApiKey, 'provider.openRouterModel': openRouterModel, 'status.activeProvider': activeProvider,
} = defineConfigs('magicWand', {
  'magics': Object as ConfigType<Magics>,
  'provider.openRouterApiKey': String,
  'provider.openRouterModel': String,
  'status.activeProvider': String,
})
