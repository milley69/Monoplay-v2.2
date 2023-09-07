import type { Modal, ModalType } from '@/types'
import { defineStore } from 'pinia'

export const useModal = defineStore('ModalPinia', {
  state: () => ({ modal: <Modal>{} }),
  getters: {
    isModal({ modal }) {
      return !!(modal.data && modal.path && modal.type)
    },
  },
  actions: {
    setModal(data: any, path: string, type: ModalType, count?: number): void {
      this.modal = { data, path, type, count }
    },
    closeModal(): void {
      this.modal = {}
    },
  },
})
