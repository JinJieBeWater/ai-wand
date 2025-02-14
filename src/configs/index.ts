import os from 'node:os'
import fs from 'node:fs'
import path from 'node:path'
import { type Ref, ref } from 'reactive-vscode'
import { window, workspace } from 'vscode'
import { logger } from '../utils/logger'
import { Try } from '../utils/try'
import defaultConfig from './default.json'
import type { MagicWandConfig } from './types'

export const configFolderName = '.magicwand'
export const configFileName = 'magicwand.json'
export const configFolderPath = path.join(os.homedir(), configFolderName)
export const configFilePath = path.join(os.homedir(), configFolderName, configFileName)

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

  // 创建配置文件夹
  if (!fs.existsSync(configFolderPath)) {
    fs.mkdirSync(configFolderPath)
  }
  // 创建配置文件
  if (!fs.existsSync(configFilePath)) {
    // 将默认配置文件写入配置文件
    fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2))
  }

  const { value, error } = Try(() => fs.readFileSync(configFilePath, 'utf-8'))

  if (error) {
    logger.error('读取失败:', error)
    window.showErrorMessage('读取失败: 请检查文件路径和权限')
    return defaultConfig as unknown as MagicWandConfig
  }

  config.value = parseConfig(value)

  // Method 1: 通过fs监听配置文件变化 需要安装三方库 原生重复触发
  // Method 2: 通过监听vscode的保存事件 √

  workspace.onDidSaveTextDocument(async (document) => {
    const driveLetter = document.uri.fsPath.split(':')[0].toUpperCase()
    const fsPath = driveLetter + document.uri.fsPath.slice(1)
    if (fsPath === configFilePath) {
      logger.info('配置变更')
      const newConfig = parseConfig(document.getText())
      config.value = newConfig
    }
  })

  return config
}

function parseConfig(config: string) {
  const { value, error } = Try<MagicWandConfig>(() => JSON.parse(config))
  if (error) {
    window.showErrorMessage('解析失败: 请检查配置文件格式是否正确')
    logger.error(error)
    return defaultConfig as unknown as MagicWandConfig
  }
  logger.info('解析成功')
  return value as MagicWandConfig
}

/**
 * 打开配置文件
 */
function openConfigFile() {
  // configFilePath
  workspace.openTextDocument(configFilePath).then((doc) => {
    window.showTextDocument(doc)
  })
}

export { useConfig, openConfigFile }
