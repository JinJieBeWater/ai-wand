import { logger } from "../utils/logger"

const outputParser = (output: string) => {
  // 检测是否被MarkDown的代码块包裹
  // 正则
  const regex = /```\w+\n([\s\S]*?)\n```/g
  const matches = regex.exec(output)
  if (matches) {
    // 如果有匹配则返回匹配的结果
    logger.info('outputParser', JSON.stringify(matches))
    return matches[1]
  }
  return output
}

export { outputParser }
