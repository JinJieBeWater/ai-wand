import { useDisposable } from 'reactive-vscode'
import { window, workspace } from 'vscode'
import type { Magic } from '../types/magic'
import { createMessageButler } from '../AISDK'
import { getSelectedText } from '../editor/getSelectedText'
import { createGenerateText } from '../AISDK/createGenerateText'
import { computeDiff } from '../diff/computeDiff'
import type { lifeCycleInstance } from '../editor/diffEdit'
import { diffEdit } from '../editor/diffEdit'

export async function sparkMagic(magic: Magic) {
  const textEditor = window.activeTextEditor!
  const originalText = getSelectedText(textEditor!)
  const selection = textEditor.selection
  const msgButler = createMessageButler().addUser(originalText, magic.prompt)

  const replacement = await createGenerateText(msgButler.messages)

  const diff = computeDiff(replacement, originalText, selection, {
    decorateDeletions: true,
  })

  const instances = await diffEdit(textEditor, diff)

  const cleanInstances = (targetInstances?: lifeCycleInstance[]) => {
    const instancesToClean = targetInstances || instances
    instancesToClean.forEach((instance) => {
      instance.decorations.forEach((decoration) => {
        textEditor.setDecorations(decoration, [])
      })
    })
    if (!targetInstances) {
      instances.length = 0
    }
    else {
      targetInstances.forEach((instance) => {
        const index = instances.indexOf(instance)
        if (index > -1) {
          instances.splice(index, 1)
        }
      })
    }
  }

  useDisposable(workspace.onDidSaveTextDocument((e) => {
    if (e.uri.toString() === textEditor.document.uri.toString()) {
      cleanInstances()
    }
  }))

  useDisposable(workspace.onDidChangeTextDocument((e) => {
    if (e.document.uri.toString() === textEditor.document.uri.toString()) {
      if (!e.document.isDirty) {
        cleanInstances()
      }
    }
  }))

  return instances
}
