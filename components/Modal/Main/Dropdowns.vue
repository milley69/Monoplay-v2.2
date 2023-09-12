<template>
  <div>
    <div class="dropdown -translate-y-2 z-10" :class="{ 'dropdown-open': companyV }">
      <div class="join p-px bg-info dropdown-content">
        <input
          type="number"
          min="0"
          pattern="\d+"
          v-model="companyCount"
          class="input input-bordered w-40 join-item no-spinner"
          :placeholder="isUseRofls ? '(. )Y( .)' : 'Сумма кубиков'"
        />
        <button type="button" class="btn join-item" @click="emit('pay', Number(companyCount))">
          <i class="bx bxs-paper-plane bx-sm"></i>
        </button>
      </div>
    </div>
    <div class="dropdown -translate-y-2 z-10" :class="{ 'dropdown-open': orderV }">
      <div class="join p-px bg-warning dropdown-content">
        <input
          ref="orderRef"
          type="number"
          min="0"
          pattern="\d+"
          v-model="orderCount"
          class="input input-bordered w-40 join-item no-spinner"
          :placeholder="isUseRofls ? '(. )Y( .)' : 'За сколько?'"
        />
        <button type="button" class="btn join-item" @click="getOrder">
          <i class="bx bxs-paper-plane bx-sm"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
const emit = defineEmits<{ pay: [cost: number] }>()
const props = defineProps<{ companyV: boolean; orderV: boolean }>()

const { isUseRofls } = storeToRefs(useUser())

const { checkBalance, setConfirmation } = useGame()
const { modal, closeModal } = useModal()
const { setToast } = useToast()

const companyCount = ref('')
const orderCount = ref('')
const orderRef = ref(<HTMLInputElement | null>null)

const getOrder = () => {
  if (Number(orderCount.value) < 0) {
    setToast('warning', 'Предупреждение 🤡', 'Я хотел сделать это пасхалкой, но отказался от этого', 5500)
    orderCount.value = ''
    return
  }
  if (!checkBalance(Number(orderCount.value))) {
    orderCount.value = ''
    return
  }
  let path
  if (modal.type === 'street') {
    path = `streets/${modal.path}`
  } else if (modal.type === 'railroad') {
    path = `railroads/${modal.data.path}`
  } else {
    path = `companies/${modal.data.path}`
  }
  setConfirmation(modal.data.owner, Number(orderCount.value), modal.data.name, path)
  closeModal()
}
watch(
  () => props.orderV,
  (order) => {
    if (order && !!orderRef.value) {
      orderRef.value.focus()
    }
  }
)
</script>
