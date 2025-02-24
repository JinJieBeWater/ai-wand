import { useConfig } from '../../../configs'
import type { Magic } from '../../../types/magic'
import type { CreateCommonQuickPickOptions } from '../mainMenu/useQuickPickFactory'
import { useQuickPickFactory } from '../mainMenu/useQuickPickFactory'

const qps = {
  confirmSave,
  inputMagicLabel,
  inputMagicDescription,
  inputMagicGroup,
}

type SaveMagicQuickPick = typeof qps

type CreateSaveMagicItemOptions = CreateCommonQuickPickOptions<SaveMagicQuickPick> & {
  magic?: Magic & {
    group?: string
  }
}

const createSaveMagicItem = useQuickPickFactory({
  qps,
})

export function useSaveMagicMenu(options: CreateSaveMagicItemOptions) {
  confirmSave(options)
}

function confirmSave(options: CreateSaveMagicItemOptions) {
  const { qp } = createSaveMagicItem({
    id: 'confirmSave',
  })
  qp.title = 'Whether to save the current magic?'

  qp.placeholder = 'Please select the save option'

  enum QPITEM {
    SAVE = 'Save',
    NO = 'No',
  }

  qp.items = [
    {
      label: QPITEM.SAVE,
      detail: '$(check) Save',
      alwaysShow: true,
    },
    {
      label: QPITEM.NO,
      detail: '$(x) not save',
      alwaysShow: true,
    },
  ]

  qp.onDidAccept(async () => {
    switch (qp.selectedItems[0].label) {
      case QPITEM.SAVE:
        inputMagicGroup(options)
        qp.dispose()
        break
      case QPITEM.NO:
        qp.dispose()
        break
    }
  })

  qp.show()
}

function inputMagicGroup(options: CreateSaveMagicItemOptions) {
  const magic = options.magic
  const { qp } = createSaveMagicItem({
    id: 'inputMagicGroup',
  })
  qp.title = 'Please input the magic group'
  qp.placeholder = 'Please input the magic group'

  qp.items = [
    {
      label: 'Next Step',
      detail: '$(arrow-right) Go to the next step',
      alwaysShow: true,
    },
    {
      label: 'Cancel',
      detail: '$(x)',
      alwaysShow: true,
    },
  ]

  qp.onDidAccept(async () => {
    switch (qp.selectedItems[0].label) {
      case 'Next Step': {
        const group = qp.value
        if (!group)
          return
        magic!.group = group
        inputMagicLabel({
          magic,
        })
        qp.dispose()
        break
      }
      case 'Cancel':
        qp.dispose()
        break
    }
  })

  qp.show()
}

function inputMagicLabel(options: CreateSaveMagicItemOptions) {
  const magic = options.magic
  const { qp } = createSaveMagicItem({
    id: 'inputMagicLabel',
  })
  qp.title = 'Please input the magic label'
  qp.placeholder = 'Please input the magic label'

  qp.items = [
    {
      label: 'Next Step',
      detail: '$(arrow-right) Go to the next step',
      alwaysShow: true,
    },
    {
      label: 'Cancel',
      detail: '$(x)',
      alwaysShow: true,
    },
  ]

  qp.onDidAccept(async () => {
    switch (qp.selectedItems[0].label) {
      case 'Next Step': {
        const label = qp.value
        if (!label)
          return
        magic!.label = label
        inputMagicDescription({
          magic,
        })
        qp.dispose()
        break
      }
      case 'Cancel':
        qp.dispose()
        break
    }
  })

  qp.show()
}

function inputMagicDescription(options: CreateSaveMagicItemOptions) {
  const magic = options.magic
  const { qp } = createSaveMagicItem({
    id: 'inputMagicDescription',
  })
  qp.title = 'Please input the magic description'
  qp.placeholder = 'Please input the magic description'

  qp.items = [
    {
      label: 'Confirm',
      detail: '$(save) Save the current magic',
      alwaysShow: true,
    },
    {
      label: 'Cancel',
      detail: '$(x) Do',
      alwaysShow: true,
    },
  ]

  qp.onDidAccept(async () => {
    switch (qp.selectedItems[0].label) {
      case 'Confirm': {
        const description = qp.value
        magic!.description = description
        const config = useConfig()
        const isGroupExist = Object.keys(config.value.magics).includes(magic!.group!)
        const magicTarget = {
          label: magic!.label,
          description: magic!.description,
          prompt: magic!.prompt,
          mode: magic!.mode,
          context: magic!.context,
        }
        if (!isGroupExist) {
          config.value.magics[magic!.group!] = [magicTarget]
        }
        else {
          config.value.magics[magic!.group!].push(magicTarget)
        }
        qp.dispose()
        break
      }
      case 'Cancel':
        qp.dispose()
        break
    }
  })

  qp.show()
}
