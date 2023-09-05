<template>
  <AppHeader is-main />
  <AppToast />
  <main class="flex flex-col mb-20 mt-12">
    <slot />
  </main>
  <AppNavigation is-main />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { loadRoom } = useGame()
const { user } = storeToRefs(useUser())
const { setRoom } = useRoom()

watch(
  () => user.value?.room,
  async (newR) => {
    setRoom(Number(newR))
    await loadRoom(Number(newR))
  }
)
</script>
