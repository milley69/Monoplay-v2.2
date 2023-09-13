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
import { IConfirm } from '@/types'
import { storeToRefs } from 'pinia'
const emit = defineEmits<{ pay: [cost: number] }>()
const props = defineProps<{ companyV: boolean; orderV: boolean }>()

const { isUseRofls, user } = storeToRefs(useUser())

const { setTemp } = useConfirm()
const { sendConfirm } = useConfirmation()

const { checkBalance } = useGame()
const { getGamerById } = useGamers()
const { modal, closeModal } = useModal()
const { setToast } = useToast()

const companyCount = ref('')
const orderCount = ref('')
const orderRef = ref(<HTMLInputElement | null>null)

const getOrder = async () => {
  if (Number(orderCount.value) < 0) {
    setToast('warning', 'Предупреждение 🤡', 'Я хотел сделать это пасхалкой, но отказался от этого', 5500)
    orderCount.value = ''
    return
  }
  if (!checkBalance(Number(orderCount.value)) || !user.value) {
    orderCount.value = ''
    return
  }

  const gamer = getGamerById(modal.data.owner)
  const orderBy: IConfirm = {
    uid: user.value.uid,
    name: user.value.name,
    giving: orderCount.value,
    names: [],
    paths: [],
  }
  const orderFor: IConfirm = { uid: gamer.uid, name: gamer.name, names: [], paths: [] }

  const path = modal.type === 'street' ? 'streets' : modal.type === 'railroad' ? 'railroads' : 'companies'
  orderFor.names.push(modal.data.name)
  orderFor.paths.push(`${path}/${modal.path}`)

  setTemp({ orderBy, orderFor, checked: false, id: Math.floor(Number(new Date()) * Math.random()) })
  await sendConfirm()
  setToast('success', 'Успех 🎉', `${gamer.name} вскоре получит уведомление с Вашим предложением!`)
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
