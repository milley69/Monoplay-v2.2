<template>
  <div class="join">
    <div class="tooltip tooltip-bottom tooltip-open tooltip-info z-10" :data-tip="rent">
      <button
        type="button"
        class="btn btn-sm join-item btn-info"
        :class="{ 'btn-disabled pointer-events-none': !isYourDice }"
        v-if="modal.type !== 'company'"
        @click="emit('pay')"
      >
        Оплатить
      </button>
      <button
        type="button"
        class="btn btn-sm join-item btn-info"
        :class="{ 'btn-disabled pointer-events-none': !isYourDice }"
        v-else
        @click="emit('dropdown')"
      >
        Оплатить
      </button>
    </div>
    <button
      type="button"
      class="btn btn-sm join-item btn-warning"
      :class="{ 'btn-disabled pointer-events-none': !isYourDice }"
      @click="emit('dropdown', true)"
    >
      Выкупить
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
const { isYourDice } = storeToRefs(useDice())

const emit = defineEmits<{ dropdown: [isOrder?: boolean]; pay: any }>()
defineProps<{ rent: number | string }>()

const { modal } = storeToRefs(useModal())
</script>
