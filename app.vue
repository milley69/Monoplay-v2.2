<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { initUser } = useAuthFB()

onMounted(async () => {
  await initUser()
})
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
