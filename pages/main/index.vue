<template>
  <div>
    <button @click="signOut" class="btn">signOut</button>
  </div>
</template>

<script lang="ts" setup>
const { signOut } = useAuthFB()
</script>
