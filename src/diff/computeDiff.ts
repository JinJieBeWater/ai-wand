import { diffLines } from 'diff'
import * as vscode from 'vscode'

export enum EditType {
  Insertion = 'Insertion',
  Deletion = 'Deletion',
  DecoratedReplacement = 'DecoratedReplacement',
}

interface InsertionEdit {
  type: EditType.Insertion
  text: string
  range: vscode.Range
}

interface DeletionEdit {
  type: EditType.Deletion
  range: vscode.Range
  oldText: string
}

interface DecoratedReplacementEdit {
  type: EditType.DecoratedReplacement
  text: string
  oldText: string
  range: vscode.Range
}

export type Edit = InsertionEdit | DeletionEdit | DecoratedReplacementEdit

interface ComputedDiffOptions {
  decorateDeletions: boolean
}

export function computeDiff(
  replacement: string,
  originalText: string,
  range: vscode.Range,
  options: ComputedDiffOptions,
): Edit[] {
  if (!replacement)
    throw new Error('replacement is empty')

  let startLine = range.start.line
  const calibratedDiff: Edit[] = []
  const diff = diffLines(
    originalText,
    replacement,
    {
      // 在执行 diff 之前删除所有尾随的 CR(\r) 字符
      stripTrailingCr: true,
      ignoreNewlineAtEof: true,
    },
  )

  for (const change of diff) {
    const count = change.count || 0

    if (change.added) {
      calibratedDiff.push({
        type: EditType.Insertion,
        text: change.value,
        range: new vscode.Range(startLine, 0, startLine + count, 0),
      })
      startLine += count
    }
    else if (change.removed) {
      if (options.decorateDeletions) {
        const oldText = change.value.split('\n').slice(0, count).join('\n')
        calibratedDiff.push({
          type: EditType.DecoratedReplacement,
          text: '\n'.repeat(count),
          oldText,
          range: new vscode.Range(startLine, 0, startLine + count, 0),
        })
        startLine += count
      }
      else {
        calibratedDiff.push({
          type: EditType.Deletion,
          range: new vscode.Range(startLine, 0, startLine + count, 0),
          oldText: change.value,
        })
      }
    }
    // 一致 不做处理
    else {
      startLine += count
    }
  }

  return calibratedDiff
}
