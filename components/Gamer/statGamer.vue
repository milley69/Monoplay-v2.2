<template>
  <div
    class="stat relative border-opacity-50"
    :class="{ 'pointer-events-none bg-neutral text-base-content': gamer.isBankrupt }"
  >
    <div>
      <div class="stat-title" :class="{ 'text-primary-content': !gamer.isBankrupt }">
        {{ gamer.name }}
      </div>
      <div class="stat-value" @click="getPay" v-if="!gamer.isBankrupt">
        <i class="bx bx-won bx-fw bx-flip-vertical"></i>{{ balance }}
      </div>
      <div class="stat-value" v-else><i class="bx bx-won bx-fw bx-flip-vertical"></i>💸</div>
      <div class="stat-actions space-x-2">
        <button type="button" class="btn btn-sm" :class="{ 'btn-disabled': gamer.isBankrupt }" @click="getTransaction">
          Перевести
        </button>
        <button
          type="button"
          class="btn btn-sm btn-warning"
          :class="{ 'btn-disabled': gamer.isBankrupt }"
          @click="getPay"
        >
          Заплатить
        </button>
      </div>
      <!--  -->
      <div
        class="grid transition-all duration-500 mt-2"
        :class="actions.transaction ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="join overflow-hidden">
          <input
            type="number"
            min="0"
            pattern="\d+"
            class="input input-bordered w-24 join-item no-spinner"
            v-model="deposit"
            @keypress.enter="depositHandler"
            placeholder="(. )Y( .)"
          />
          <button type="button" class="btn join-item" @click.prevent="depositHandler">
            <i class="bx bxs-paper-plane bx-sm"></i>
          </button>
        </div>
      </div>
      <profile-data-stat :gamer="gamer" :action="actions.pay" :uid="uid" />
    </div>
    <lazy-dice :uidprop="uid" />
  </div>
</template>

<script lang="ts" setup>
import type { Gamer } from '@/types'
const { setToast } = useToast()

const props = defineProps<{ gamer: Gamer; uid: string; balance: string }>()

const emit = defineEmits<(event: 'deposit', money: number, uid: string, deposit: number) => void>()

const actions = reactive({
  transaction: false,
  pay: false,
})

const getTransaction = () => {
  actions.pay = false
  actions.transaction = !actions.transaction
}
const getPay = () => {
  actions.transaction = false
  actions.pay = !actions.pay
}

const deposit = ref(<string>'')

const depositHandler = () => {
  if (isNaN(Number(deposit.value))) return
  if (Number(deposit.value) < 0) {
    setToast('warning', 'Предупреждение 🤡', 'Я хотел сделать это пасхалкой, но отказался от этого', 5500)
    deposit.value = ''
    return
  }
  emit('deposit', props.gamer.money, props.uid, Number(deposit.value))
  deposit.value = ''
}
</script>
