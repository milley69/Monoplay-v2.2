<template>
  <div class="join">
    <div class="tooltip tooltip-bottom tooltip-open tooltip-info z-10" :data-tip="rent">
      <button type="button" class="btn btn-sm join-item btn-info" v-if="type !== 'company'" @click="emit('pay')">
        Оплатить
      </button>
      <button type="button" class="btn btn-sm join-item btn-info" v-else @click="emit('dropdown')">Оплатить</button>
    </div>
    <button type="button" class="btn btn-sm join-item btn-warning" @click="emit('dropdown', true)">Выкупить</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ dropdown: [isOrder?: boolean]; pay: any }>()
defineProps<{ rent: number | string }>()

const { type } = useModal().modal
</script>
