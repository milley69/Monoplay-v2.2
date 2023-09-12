<template>
  <li @click.stop.prevent="copyRoom">
    <div class="tooltip tooltip-top" :class="{ 'tooltip-open': isCopyRoom }" data-tip="Copied! 🎉">
      <span class="relative">
        <input type="text" class="input input-bordered" readonly :value="room" :size="sizeRoom" />
        <i class="bx bx-copy-alt bx-fw absolute top-1/2 -translate-y-1/4 right-2.5"></i>
      </span>
    </div>
  </li>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
const { room } = storeToRefs(useRoom())

const sizeRoom = computed(() => (room.value ? room.value.toString().length + 1 : 15))

const isCopyRoom = ref(false)

const copyRoom = () => {
  const element = document.createElement('textarea')
  element.value = `Monoplay: ${room.value}`
  document.body.appendChild(element)
  element.select()
  document.execCommand('copy')
  document.body.removeChild(element)
  isCopyRoom.value = true
  setTimeout(() => {
    isCopyRoom.value = false
  }, 500)
}
</script>
