import { useCms } from '../utils/useCms'
import { openMagicsSettings } from './openSettings'
import { showMagics } from './showMagics'

export function initCommands() {
  useCms({
    'magic-wand.showMagics': showMagics,
    'magic-wand.magics-settings': openMagicsSettings,
  })
}
