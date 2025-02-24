import { useEditContextQuickPick } from './useEditContextQuickPick'
import { useLiveEditQuickPick } from './useLiveEditQuickPick'
import useMagicQuickPick from './useMagicQuickPick'
import { useEditProviderToggle, usePrimaryProviderToggle } from './useProviderToggle'
import type { CreateCommonQuickPickOptions } from './useQuickPickFactory'
import { useQuickPickFactory } from './useQuickPickFactory'

const qps = {
  useEditProviderToggle,
  useLiveEditQuickPick,
  useMagicQuickPick,
  useEditContextQuickPick,
  usePrimaryProviderToggle,
}

export type MainMenuQuickPick = typeof qps

export type CreateMainMenuItemOptions = CreateCommonQuickPickOptions<MainMenuQuickPick>

export const createMainMenuItem = useQuickPickFactory({
  qps,
})
