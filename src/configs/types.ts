import type { Magics } from '../types/magic'
import type { providerOptions } from './constans'

type ProviderOptions = typeof providerOptions[number]

interface Provider {
  name: ProviderOptions
  apiKey: string
  model: string
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
  providers: Provider[]
  magics: Magics
}
