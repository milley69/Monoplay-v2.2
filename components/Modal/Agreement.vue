<template>
  <input type="checkbox" aria-label="modalAgreement" checked v-if="isOpen" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box max-w-xs space-y-4">
      <h3 class="text-lg font-bold">Подтверждение</h3>

      <p>{{ msg }}</p>

      <button class="join-item btn btn-primary btn-outline w-full" @click="successModalAgree">Подтверждаю</button>
    </div>
    <div class="modal-backdrop backdrop-blur-[2px]" @click="$emit('close')"></div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const props = defineProps<{
  isOpen: boolean
  isAdmin: boolean
  msg: string
  type: 'delete' | 'leave' | 'reset' | 'bankrupt' | ''
}>()
const emit = defineEmits(['close'])

const { resetBoard, deleteRoom, onBankrupt } = useGame()
const { gamer } = storeToRefs(useGamers())

const successModalAgree = async () => {
  if (props.type === 'delete') await deleteRoom()
  else if (props.type === 'leave') leave()
  else if (props.type === 'reset') await resetBoard()
  else if (props.type === 'bankrupt') await onBankrupt(gamer.value.uid)
  emit('close')
}

const leave = () => {
  if (props.isAdmin) {
    useToast().setToast('error', 'Ой... 🐱', 'Вы не можете покинуть свою комнату!', 4000)
    return
  }
  console.log('oks')
}
</script>
