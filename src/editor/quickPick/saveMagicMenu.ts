import type { CreateCommonQuickPickOptions } from './mainMenu/useQuickPickFactory'
import { useQuickPickFactory } from './mainMenu/useQuickPickFactory'

const qps = {
}

export type SaveMagicQuickPick = typeof qps

export type CreateSaveMagicItemOptions = CreateCommonQuickPickOptions<SaveMagicQuickPick>

export const createSaveMagicItem = useQuickPickFactory({
  qps,
})
