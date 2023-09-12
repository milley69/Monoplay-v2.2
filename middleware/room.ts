import { useToast } from '@/stores/toast'
import { storeToRefs } from 'pinia'

export default defineNuxtRouteMiddleware((to, from) => {
  const { isValidRoom } = storeToRefs(useRoom())
  const { setToast } = useToast()

  if (!isValidRoom.value) {
    setToast('error', 'Ошибка! 🐸', 'Для начала создайте или присоединитесь к комнате!', 5500)
    return navigateTo('/main')
  }
})
