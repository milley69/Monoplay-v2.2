import type { Toast, ToastType } from '@/types'
import { defineStore } from 'pinia'

export const useToast = defineStore('toastPinia', () => {
  const toasts = ref(<Toast[]>[])

  const toastsLen = computed(() => toasts.value.length)

  const setToast = (type: ToastType, title: string, messageOrError: unknown, duration: number = 4000) => {
    let message = ''

    if (messageOrError instanceof Error) message = messageOrError.message
    if (typeof messageOrError === 'string') message = messageOrError

    const toast: Toast = { type, title, message, id: Math.floor(Number(new Date()) * Math.random()) }

    toasts.value.push(toast)
    setTimeout(removeToast.bind(this), duration * (toastsLen.value + 1), toast)
  }

  const removeToast = (toast: Toast) => {
    toasts.value = toasts.value.filter((t) => t.id != toast.id)
  }

  return { toasts, toastsLen, setToast, removeToast }
})
