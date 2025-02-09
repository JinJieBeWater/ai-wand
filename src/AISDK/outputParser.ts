import { Context } from "../magic"
import { logger } from "../utils/logger"

const outputParser = (context: Context, output: string) => {
  const { language } = context
  if (language === 'md' || language === 'mdx' || language === 'markdown') {
    return output
  }
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
