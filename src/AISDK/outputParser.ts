import type { Context } from '../magic'

function outputParser(context: Context, output: string) {
  const { language } = context
  if (language === 'md' || language === 'mdx' || language === 'markdown') {
    return output
  }
  const regex = /```\w+\n([\s\S]*?)\n```/
  const matches = regex.exec(output)
  if (matches) {
    return matches[1]
  }
  return output
}

export { outputParser }
