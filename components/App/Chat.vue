<template>
  <div class="chat" :class="direction === 'left' ? 'chat-start' : 'chat-end'">
    <div class="chat-image avatar" v-if="path">
      <div class="w-10 rounded-full">
        <img :src="path" :alt="alt" />
      </div>
    </div>
    <div class="chat-bubble" :class="chatBg">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
type ChatBg =
  | 'chat-bubble-primary'
  | 'chat-bubble-secondary'
  | 'chat-bubble-accent'
  | 'chat-bubble-info'
  | 'chat-bubble-success'
  | 'chat-bubble-warning'
  | 'chat-bubble-error'
const props = defineProps<{ path: string; alt?: string; direction: 'left' | 'right'; chatBg?: ChatBg }>()
</script>
