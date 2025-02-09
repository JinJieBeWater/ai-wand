import type { TextEditor, TextEditorDecorationType } from 'vscode'
import { Position, Range } from 'vscode'
import type { Edit } from '../diff/computeDiff'
import { EditType, makeDiffEditBuilderCompatible } from '../diff/computeDiff'
import { createDeletionDecoration, createInsertedDecoration } from './decoration'

export interface lifeCycleInstance {
  decorations: TextEditorDecorationType[]
  textEditor: TextEditor
  edit: Edit
  isActive: boolean
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

async function useDeletionDecoration(instance: lifeCycleInstance) {
  const { textEditor, decorations, edit } = instance
  if (edit.type === EditType.DecoratedReplacement) {
    const lines = edit.oldText.split('\n')
    const startLine = edit.range.start.line
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]

      const decoration = createDeletionDecoration(line)
      decorations.push(decoration)

      const currentPostion = new Position(startLine + index, 0)
      const currentRange = new Range(currentPostion, currentPostion)

      textEditor.setDecorations(decoration, [currentRange])
      await new Promise(resolve => setTimeout(resolve, 50))
    }
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
    isActive: true,
  }
  await textEditor.edit((editBuilder) => {
    switch (part.type) {
      case EditType.Insertion:
        editBuilder.insert(part.range.start, part.text)
        break
      case EditType.Deletion:
        editBuilder.delete(part.range)
        break
      case EditType.DecoratedReplacement:
        editBuilder.replace(part.range, part.text)
        break
      default:
        throw new Error('Unknown edit type')
    }
  }).then(async (success) => {
    if (!success) {
      await diffEditItem(textEditor, part)
    }
    else {
      switch (part.type) {
        case EditType.Insertion:
          useInsertionDecoration(instance)
          break
        case EditType.Deletion:
          break
        case EditType.DecoratedReplacement:
          useDeletionDecoration(instance)
          break
        default:
          throw new Error('Unknown edit type')
      }
    }
  })

  return instance
}

export async function diffEdit(textEditor: TextEditor, diff: Edit[]) {
  const suitableDiff = makeDiffEditBuilderCompatible(diff)
  const instances: lifeCycleInstance[] = []
  textEditor.edit((editBuilder) => {
    diff.forEach((part,index) => {
      const instance: lifeCycleInstance = {
        decorations: [],
        textEditor,
        edit: part,
        isActive: true,
      }
      instances.push(instance)
      const suitablePart = suitableDiff[index]
      switch (part.type) {
        case EditType.Insertion:
          editBuilder.insert(suitablePart.range.start, part.text)
          break
        case EditType.Deletion:
          editBuilder.delete(suitablePart.range)
          break
        case EditType.DecoratedReplacement:
          editBuilder.replace(suitablePart.range, part.text)
          break
        default:
          throw new Error('Unknown edit type')
      }
    })
  }).then(async (success) => {
    if (!success) {
      await diffEdit(textEditor, diff)
    }
    else {
      for (const instance of instances) {
        const part = instance.edit
        switch (part.type) {
          case EditType.Insertion:
            useInsertionDecoration(instance)
            break
          case EditType.Deletion:
            break
          case EditType.DecoratedReplacement:
            useDeletionDecoration(instance)
            break
          default:
            throw new Error('Unknown edit type')
        }
      }
    }
  })
  return instances
}
