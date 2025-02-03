import { window } from 'vscode'
import type { Magic } from '../types/magic'
import { createMessageButler } from '../AISDK'
import { getSelectedText } from '../utils/getSelectedText'
import { createGenerateText } from '../AISDK/createGenerateText'
import { computeDiff } from '../diff/computeDiff'
import { diffEdit } from '../editor/diffEdit'

export async function sparkMagic(magic: Magic) {
  const textEditor = window.activeTextEditor!
  const originalText = getSelectedText(textEditor!)
  const msgButler = createMessageButler().addUser(originalText, magic.prompt)

  const replacement = await createGenerateText(msgButler.messages)

  const diff = computeDiff(replacement, originalText, textEditor.selection, {
    decorateDeletions: true,
  })

  const instances = await diffEdit(textEditor, diff)
  return instances
}
