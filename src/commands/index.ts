import { useCms } from '../utils/useCms'
import useMagicQuickPick, { } from '../editor/useMagicQuickPick'
import { openMagicsSettings } from './openSettings'

export function initCommands() {
  useCms({
    'magic-wand.quick-pick.showMagics': () => {
      const qp = useMagicQuickPick()
      qp.show()
    },
    'magic-wand.magics-settings': () => {
      openMagicsSettings()
    },
  })
}
