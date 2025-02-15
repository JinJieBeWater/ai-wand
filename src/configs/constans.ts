import path from 'node:path'
import os from 'node:os'

export enum ProviderOptions {
  openai = 'openai',
  deepseek = 'deepseek',
  openRouter = 'openRouter',
  ollama = 'ollama',
  openaiAdaptedServer = 'openaiAdaptedServer',
}

export const providerOptions = [
  ...Object.values(ProviderOptions),
] as const

export const configFolderName = '.magicwand'
export const configFileName = 'magicwand.json'
export const configFolderPath = path.join(os.homedir(), configFolderName)
export const configFilePath = path.join(os.homedir(), configFolderName, configFileName)
