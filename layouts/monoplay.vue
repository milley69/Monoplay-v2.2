<template>
  <LazyAppToast />
  <LazyModalMain v-if="isModal" />
  <LazyAppHeader />
  <main class="flex flex-col mb-20 mt-12">
    <slot />
  </main>
  <lazy-rofls-donate-rats :money="money" />
  <LazyAppNavigation />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { loadRoom } = useGame()
const { room } = storeToRefs(useRoom())

const { gamer } = storeToRefs(useGamers())
const { isModal } = storeToRefs(useModal())
const toasts = useToast()

onMounted(async () => {
  if (room.value) await loadRoom(room.value)
  useListener()
})

const money = ref(0)

watch(
  () => gamer.value?.money,
  (newM, oldM) => {
    if (
      oldM &&
      newM &&
      oldM < newM &&
      (toasts.toastsLen === 0 || toasts.toasts[toasts.toastsLen - 1].type !== 'success')
    ) {
      money.value = newM - oldM
      toasts.setToast('info', 'Внимание! 🔮', `Вам зачислено <${money.value}> !`)
    }
  }
)
</script>
