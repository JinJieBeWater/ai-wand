import type { TextEditor, TextEditorDecorationType } from 'vscode'
import { Range } from 'vscode'
import type { Edit } from '../diff/computeDiff'
import { EditType } from '../diff/computeDiff'
import { createDeletionDecoration, createInsertedDecoration } from './decoration'

interface lifeCycleInstance {
  decorations: TextEditorDecorationType[]
  textEditor: TextEditor
  edit: Edit
}

function useInsertionDecoration(instance: lifeCycleInstance) {
  const { textEditor, decorations, edit } = instance
  setImmediate(() => {
    decorations.push(createInsertedDecoration())
    decorations.forEach((decoration) => {
      textEditor.setDecorations(decoration, [edit.range])
    })
  })
}

function useDeletionDecoration(instance: lifeCycleInstance) {
  const { textEditor, decorations, edit } = instance
  if (edit.type === EditType.DecoratedReplacement) {
    const lines = edit.oldText.split('\n')
    const position = edit.range.start
    lines.forEach((line) => {
      const decoration = createDeletionDecoration(line)
      decorations.push(decoration)
      textEditor.setDecorations(decoration, [new Range(position, position)])
      console.log(`选中的代码:${line}`)
    })
  }
  else {
    throw new Error('createDeletionDecoration only support EditType.DecoratedReplacement')
  }
}

export async function diffEditItem(textEditor: TextEditor, part: Edit): Promise<lifeCycleInstance> {
  const instance: lifeCycleInstance = {
    decorations: [],
    textEditor,
    edit: part,
  }
  await textEditor.edit((editBuilder) => {
    switch (part.type) {
      case EditType.Insertion:
        editBuilder.insert(part.range.start, part.text)
        useInsertionDecoration(instance)
        break
      case EditType.Deletion:
        editBuilder.delete(part.range)
        break
      case EditType.DecoratedReplacement:
        editBuilder.replace(part.range, part.text)
        useDeletionDecoration(instance)
        break
      default:
        throw new Error('Unknown edit type')
    }
  }).then(async (success) => {
    if (!success) {
      await diffEditItem(textEditor, part)
    }
  })

  return instance
}

export async function diffEdit(textEditor: TextEditor, diff: Edit[]) {
  const instances: lifeCycleInstance[] = []
  for (const part of diff) {
    const instance = await diffEditItem(textEditor, part)
    instances.push(instance)
  }
  return instances
}
