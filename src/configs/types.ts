import type { Magics } from '../types/magic'
import type { ProviderOptions } from './constans'

interface Provider {
  apiKey?: string
  modelList: string[]
  baseURL?: string
}

export interface MagicWandConfig {
  active: {
    primaryProvider: {
      provider: ProviderOptions
      model: string
    }
    editProvider: {
      provider: ProviderOptions
      model: string
    }
  }
  providers: {
    [key in ProviderOptions]: Provider
  }
  magics: Magics
}
