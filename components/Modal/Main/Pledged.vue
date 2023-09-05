<template>
  <button type="button" class="btn btn-sm btn-error join-item" @click="pledgedIt" :class="{ 'btn-disabled': checkOn }">
    Заложить
  </button>
</template>

<script setup lang="ts">
const { pledgedSmth } = useGame()
const { modal, closeModal } = useModal()
const { uid } = useAuth()

const pledgedIt = () => {
  if (!modal.path) return
  if (modal.type === 'street') {
    pledgedSmth(`streets/${modal.path}`, modal.data.pledge, modal.data.housePrice)
  } else if (modal.type === 'railroad') {
    pledgedSmth(`railroads/${modal.path}`, modal.data.pledge)
  } else if (modal.type === 'company') {
    pledgedSmth(`companies/${modal.path}`, modal.data.pledge)
  }
  closeModal()
}
const checkOn = computed(() => !modal.data.owner || modal.data.owner !== uid)
</script>
