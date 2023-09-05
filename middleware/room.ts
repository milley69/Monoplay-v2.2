import { useToast } from '@/stores/toast'
import { storeToRefs } from 'pinia'

export default defineNuxtRouteMiddleware((to, from) => {
  const { isValidRoom } = storeToRefs(useRoom())
  const { setToast } = useToast()

  setTimeout(() => {
    if (isValidRoom.value) return true
    else {
      setToast('error', 'Ошибка! 🐸', 'Для начала создайте или присоеденитесь к комнате!', 5500)
      return false
    }
  }, 200)
})
