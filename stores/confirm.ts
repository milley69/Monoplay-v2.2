import { defineStore } from 'pinia'

interface IConfirm {
  uid: string
  name: string
  giving?: string
  names: string[]
  paths: string[]
}

export interface TempState {
  orderBy: IConfirm
  orderFor: IConfirm
  checked: boolean
  id: number
}
export const useConfirm = defineStore('ConfirmPinia', {
  state: () => ({
    temp: <TempState | object>{},
    confirms: <TempState[]>[],
  }),
  getters: {},
  actions: {
    setTemp(temp: TempState) {
      this.temp = temp
    },
    removeTemp() {
      this.temp = {}
    },
    addConfirm(data: TempState) {
      for (const [id, value] of Object.entries(data) as [string, TempState][]) {
        const checkId = this.confirms.findLast((el) => el.id === Number(id))
        if (!checkId) this.confirms.push({ ...value })
      }
    },
  },
})
