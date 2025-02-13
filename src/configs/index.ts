import os from 'node:os'
import fs from 'node:fs'
import path from 'node:path'
import { type Ref, ref } from 'reactive-vscode'
import { logger } from '../utils/logger'
import { Try } from '../utils/try'
import defaultConfig from './default.json'
import type { MagicWandConfig } from './types'

let isConfigInitialized = false
const config: Ref<MagicWandConfig | undefined> = ref(undefined)

/**
 * 初始化配置
 */
function useConfig() {
  if (isConfigInitialized) {
    return config
  }
  isConfigInitialized = true

  logger.info('开始初始化配置')

  const configFolderName = '.magicwand'
  const configFileName = 'magicwand.json'
  const configFolderPath = path.join(os.homedir(), configFolderName)
  const configFilePath = path.join(os.homedir(), configFolderName, configFileName)

  // 创建配置文件夹
  if (!fs.existsSync(configFolderPath)) {
    fs.mkdirSync(configFolderPath)
  }
  // 创建配置文件
  if (!fs.existsSync(configFilePath)) {
    // 将默认配置文件写入配置文件
    fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2))
  }

  config.value = parseConfig(configFilePath)

  // fs 监听配置文件变化
  fs.watch(configFilePath, (eventType, filename) => {
    if (eventType === 'change') {
      logger.info('配置文件发生变化:', filename)
      const newConfig = parseConfig(configFilePath)
      config.value = newConfig
    }
  })
  logger.info('配置初始化完成')

  return config
}

function parseConfig(configFilePath: string) {
  const { value, error } = Try<MagicWandConfig>(() => JSON.parse(fs.readFileSync(configFilePath, 'utf-8')))
  if (error) {
    logger.error('解析配置文件失败: 请检查配置文件格式是否正确')
    logger.error(error)
    return defaultConfig as unknown as MagicWandConfig
  }
  logger.info('解析配置文件成功')
  return value as MagicWandConfig
}

export { useConfig }
