<template>
  <button
    class="btn btn-sm btn-error join-item"
    type="button"
    @click="redemptionIt"
    :class="{ 'btn-disabled': checkOn, 'btn-disabled pointer-events-none': !isYourDice }"
  >
    Выкупить
  </button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
const { isYourDice } = storeToRefs(useDice())
const { redemptionSmth } = useGame()
const { modal, closeModal } = useModal()
const { uid } = useUser()

const redemptionIt = () => {
  if (!modal.path) return
  if (modal.type === 'street') {
    redemptionSmth(`streets/${modal.path}`, modal.data.redemption)
  } else if (modal.type === 'railroad') {
    redemptionSmth(`railroads/${modal.path}`, modal.data.redemption)
  } else if (modal.type === 'company') {
    redemptionSmth(`companies/${modal.path}`, modal.data.redemption)
  }
  closeModal()
}
const checkOn = computed(() => !modal.data.owner || modal.data.owner !== uid)
</script>
