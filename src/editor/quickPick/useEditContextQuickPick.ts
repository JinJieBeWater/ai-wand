import type { QuickPickItem } from 'vscode'
import { MagicContextMode } from '../../types/magic'
import type { CreateQuickPickOptions } from '.'
import { QuickPickId, createCommonQuickPick } from '.'

function useEditContextQuickPick(options: CreateQuickPickOptions) {
  const { qp, stack, back } = createCommonQuickPick({
    id: QuickPickId.editContext,
    ...options,
  })

  qp.title = 'Edit Context'
  qp.placeholder = 'select the context'
  qp.canSelectMany = true
  const items: QuickPickItem[] = [
    {
      label: MagicContextMode.currentFile,
      detail: 'Send the current file to the model',
      alwaysShow: true,
    },
    {
      label: MagicContextMode.openTabs,
      detail: 'Send the open tabs to the model',
      alwaysShow: true,
    },
  ]
  qp.items = items
  qp.selectedItems = [items[0]]

  qp.onDidAccept(() => {
    back(qp.selectedItems)
  })

  qp.show()

  return { qp, stack }
}

export { useEditContextQuickPick }
