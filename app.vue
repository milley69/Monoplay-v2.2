<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { User } from './types'

const { initUser } = useAuthFB()
const { setUser } = useUser()
const { user } = storeToRefs(useUser())

onMounted(async () => {
  const lsUser = localStorage.getItem('monoplay_user')
  const user: User | null = lsUser ? JSON.parse(lsUser) : null
  if (user) setUser(user)
  else await initUser()
})

watch(
  () => user.value,
  (newUser) => {
    if (newUser) localStorage.setItem('monoplay_user', JSON.stringify(newUser))
    else localStorage.removeItem('monoplay_user')
  },
  { deep: true }
)
</script>

<style>
.qwe {
  border: 1px solid salmon;
}
.qwe2 * {
  border: 1px solid salmon;
}
.qwe3 > * {
  border: 1px solid salmon;
}
</style>
