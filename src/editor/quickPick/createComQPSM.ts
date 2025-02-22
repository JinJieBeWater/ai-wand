import { useLiveEditQuickPick } from './useLiveEditQuickPick'
import useMagicQuickPick from './useMagicQuickPick'
import { useEditContextQuickPick } from './useEditContextQuickPick'
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

export type ShowMagicQPs = typeof qps

export type CreateComQPSMOpts = CreateCommonQuickPickOptions<ShowMagicQPs>

export const createComQPSM = useQuickPickFactory({
  qps,
})
