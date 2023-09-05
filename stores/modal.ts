import type { Modal, ModalType } from '@/types'
import { defineStore } from 'pinia'

// export const useModal = defineStore('ModalPinia', {
//   state: () => ({ modal: <Modal>{} }),
//   getters: {
//     isModal({ modal }) {
//       return !!(modal.data && modal.path && modal.type)
//     },
//   },
//   actions: {
//     setModal(data: any, path: string, type: ModalType, count?: number): void {
//       this.modal = { data, path, type, count }
//     },
//     closeModal(): void {
//       this.modal = {}
//     },
//   },
// })
export const useModal = defineStore('ModalPinia', () => {
  let modal = reactive(<Modal>{})

  const isModal = computed(() => !!(modal.data && modal.path && modal.type))

  const setModal = (data: any, path: string, type: ModalType, count?: number) => (modal = { data, path, type, count })
  const closeModal = () => (modal = {})

  return { modal, isModal, setModal, closeModal }
})
