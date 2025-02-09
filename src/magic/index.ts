import { reactive, useDisposable, watchEffect } from 'reactive-vscode'
import type { Disposable, TextEditor } from 'vscode'
import { window, workspace } from 'vscode'
import type { Magic } from '../types/magic'
import { createMessageButler } from '../AISDK'
import { getSelectedText } from '../editor/getSelectedText'
import { computeDiff } from '../diff/computeDiff'
import type { lifeCycleInstance } from '../editor/diffEdit'
import { diffEdit } from '../editor/diffEdit'
import { connectAISDK } from '../AISDK/connectAISDK'

export interface Context {
  magic: Magic
  textEditor: TextEditor
  originalText: string
  language?: string
  msgButler?: ReturnType<typeof createMessageButler>
}

export async function sparkMagic(magic: Magic) {
  const textEditor = window.activeTextEditor!
  const originalText = getSelectedText(textEditor!)
  const selection = textEditor.selection
  const language = textEditor.document.fileName.split('.').pop()
  const context: Context = {
    magic,
    textEditor,
    originalText,
    language,
  }
  const msgButler = createMessageButler(context).addUser(originalText, magic.prompt)
  context.msgButler = msgButler

  const replacement = await connectAISDK({
    context,
    messages: msgButler.messages,
    selection,
  })

  if (replacement === undefined)
    return

  const diff = computeDiff(replacement, originalText, selection, {
    decorateDeletions: true,
  })

  const instances = reactive(await diffEdit(textEditor, diff))

  const setInstances = (isActive: boolean, targetInstances?: lifeCycleInstance[]) => {
    const instancesToSet = targetInstances || instances
    instancesToSet.forEach((instance) => {
      instance.isActive = isActive
    })
  }

  const disposables: Disposable[] = []

  disposables.push(useDisposable(workspace.onDidSaveTextDocument((e) => {
    if (e.uri.toString() === textEditor.document.uri.toString()) {
      setInstances(false)
      disposables.forEach(d => d.dispose())
    }
  })))

  disposables.push(useDisposable(workspace.onDidChangeTextDocument((e) => {
    if (e.document.uri.toString() === textEditor.document.uri.toString()) {
      if (!e.document.isDirty) {
        setInstances(false)
      }
      else {
        const contentChanges = e.contentChanges[0]
        const undoRange = contentChanges.range
        const targetInstances: lifeCycleInstance[] = []
        for (let i = instances.length - 1; i >= 0; i--) {
          const instance = instances[i]
          const isRangeEqual = JSON.stringify(instance.edit.range) === JSON.stringify(undoRange)
          if (isRangeEqual) {
            targetInstances.push(instance)
            break
          }
        }
        setInstances(false, targetInstances)
      }
    }
  })),
  )

  watchEffect(() => {
    instances.forEach((instance) => {
      if (!instance.isActive) {
        instance.decorations.forEach((decoration) => {
          textEditor.setDecorations(decoration, [])
        })
      }
    })
  })

  return instances
}
