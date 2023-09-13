import type { ConfirmState } from '@/types'
import { defineStore } from 'pinia'

export const useConfirm = defineStore('ConfirmPinia', {
  state: () => ({
    temp: <ConfirmState | object>{},
    confirms: <ConfirmState[]>[],
  }),
  getters: {
    confirmsLen({ confirms }) {
      return confirms.reduce((count, confirm) => (confirm.checked ? count : count + 1), 0)
    },
  },
  actions: {
    setTemp(temp: ConfirmState) {
      this.temp = temp
    },
    removeTemp() {
      this.temp = {}
    },
    checkConfirm(id: number) {
      const idx = this.confirms.findIndex((el) => el.id === id)
      this.confirms[idx].checked = true
    },
    addConfirm(data: ConfirmState) {
      for (const [id, value] of Object.entries(data) as [string, ConfirmState][]) {
        const checkId = this.confirms.findLast((el) => el.id === Number(id))
        if (!checkId && !value.checked) {
          const { setToast } = useToast()
          this.confirms.push({ ...value })
          setToast('info', 'Уведомление ✨', '<- У вас новое предложение обмена!')
        }
      }
    },
  },
})
