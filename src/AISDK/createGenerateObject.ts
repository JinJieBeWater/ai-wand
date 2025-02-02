import type { CoreMessage } from 'ai'
import { APICallError, generateObject } from 'ai'
import { z } from 'zod'
import { window } from 'vscode'
import { logger } from '../utils/logger'
import { getModel } from './getModel'

// 三种状态
// 1. 插入
// 2. 删除
// 3. 不变
const schema = z.object({
  blocks: z.array(z.object({
    generatedCode: z.string().optional().describe('The generated code'),
    originalCode: z.string().optional().describe('The original code'),
    isDeleted: z.boolean().describe('Whether the original code is deleted'),
    isInserted: z.boolean().describe('Whether the generated code is inserted'),
  })).describe('Split the output code into blocks'),
})

interface CreateGenerateObjectProps {
  messages: CoreMessage[]
}

async function createGenerateObject({ messages }: CreateGenerateObjectProps) {
  try {
    const result = await generateObject({
      model: getModel(),
      schema,
      messages,
      mode: 'json',
    })
    return result
  }
  catch (error) {
    logger.error('generateObject', JSON.stringify(error))
    window.showErrorMessage('generateObject', JSON.stringify(error))
    throw error
  }
}

export { createGenerateObject }
