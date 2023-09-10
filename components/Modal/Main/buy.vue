<template>
  <div
    class="tooltip tooltip-bottom z-10"
    :class="{
      'tooltip-info': modal.type === 'street',
      'tooltip-open ': modal.data.owner !== uid,
      'tooltip-warning ': modal.type === 'railroad',
      'tooltip-success ': modal.type === 'company',
    }"
    :data-tip="modal.data.price"
  >
    <button
      class="btn btn-sm join-item"
      :class="{
        'btn-info': modal.type === 'street',
        'btn-disabled ': modal.data.owner === uid,
        'btn-warning': modal.type === 'railroad',
        'btn-success': modal.type === 'company',
        'btn-disabled pointer-events-none': !isYourDice,
      }"
      @click="buyIt(modal.data.price)"
    >
      Купить
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
const { isYourDice } = storeToRefs(useDice())
const { buySmth } = useGame()
const { uid } = useUser()
const { modal, closeModal } = useModal()

const buyIt = (cost: number) => {
  if (!modal.path) return
  if (modal.type === 'street') {
    buySmth(`streets/${modal.path}`, uid, cost)
  } else if (modal.type === 'railroad') {
    buySmth(`railroads/${modal.path}`, uid, cost)
  } else if (modal.type === 'company') {
    buySmth(`companies/${modal.path}`, uid, cost)
  }
  closeModal()
}
</script>

<style scoped></style>
