<template>
  <div class="tooltip tooltip-bottom tooltip-open z-10 tooltip-info" :data-tip="modal.data.housePrice">
    <button
      v-if="purchase"
      type="button"
      class="btn btn-sm join-item"
      :class="{
        'btn-info': modal.type === 'street',
        'btn-disabled ': !rentColor,
        'btn-disabled pointer-events-none': !isYourDice,
      }"
      @click="openPurchase"
    >
      Докупить
    </button>
    <button
      v-else
      type="button"
      class="btn btn-sm join-item"
      :class="{
        'btn-info': modal.type === 'street',
        'btn-disabled ': !rentColor,
      }"
      @click="openPurchase"
    >
      Применить
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
const { isYourDice } = storeToRefs(useDice())
const { modal } = useModal()
const emit = defineEmits(['purchase'])

defineProps<{ rentColor: boolean }>()
const purchase = ref(true)
const openPurchase = () => {
  purchase.value = !purchase.value
  emit('purchase')
}
</script>
