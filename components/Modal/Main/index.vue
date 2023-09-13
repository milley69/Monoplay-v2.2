<template>
  <input type="checkbox" :aria-label="modal.type || 'modal'" checked class="modal-toggle" />
  <div class="modal">
    <div class="modal-box max-w-xs">
      <h3 class="text-lg font-bold">{{ modal.data.name }}</h3>
      <p>Владелец: {{ getOwner(modal.data.owner) }}</p>
      <ModalMainPayments
        v-if="modal.data.owner && modal.data.owner !== uid"
        :rent="findRentedProperty"
        @dropdown="dropdownOpen"
        @pay="pay"
      />
      <div class="join" v-else>
        <ModalMainPurchase
          v-if="isRentColorBought"
          :rent-color="isRentColorBought"
          @purchase="onPurchase = !onPurchase"
        />
        <ModalMainBuy v-else />
        <div
          class="tooltip tooltip-bottom tooltip-error z-10"
          :class="{ 'tooltip-open': modal.data.owner || modal.data.owner === uid }"
          :data-tip="pledgedTip"
        >
          <ModalMainPledged v-if="!modal.data.isPledged" />
          <ModalMainRedemption v-else />
        </div>
      </div>
      <ModalMainDropdowns :companyV="companyDropdown" :orderV="orderDropdown" @pay="pay" />
      <ModalMainList
        :rents="modal.data.rent"
        :type="modal.type"
        :quantityRent="findRentedProperty"
        :purchase="onPurchase"
      />
    </div>
    <div class="modal-backdrop backdrop-blur-[2px]" @click="closeModal"></div>
  </div>
</template>

<script setup lang="ts">
import type { IRent } from '@/types'
import { storeToRefs } from 'pinia'
const { onPay } = useGame()
const { modal, closeModal } = useModal()
const { setToast } = useToast()
const { gamer, gamers } = storeToRefs(useGamers())
const { uid } = storeToRefs(useUser())
const { removeTemp } = useConfirm()

const onPurchase = ref(false)

const getOwner = (user: string) => (user === uid.value ? gamer.value?.name : gamers.value[user]?.name || 'отсутствует')

const orderDropdown = ref(false)
const companyDropdown = ref(false)
const tooltipOpen = (isOpen: boolean) => isOpen

onUnmounted(() => {
  removeTemp()
})

const dropdownOpen = (isOrder = false) => {
  if (isOrder) {
    companyDropdown.value = false
    orderDropdown.value = !orderDropdown.value
    return
  }
  orderDropdown.value = false
  companyDropdown.value = !companyDropdown.value
}

const pay = async (cost?: number) => {
  const rent = cost ? cost * findRentedProperty.value.substring(1) : findRentedProperty.value
  const owner = await onPay(modal.data.owner, rent)
  if (owner) setToast('success', 'Благодарность 🙌', `Спасибо за перевод для ${owner}!`)
  else setToast('error', 'Упсс 📉', `У вас недостаточно средств!`)
  closeModal()
}

const findRentedProperty = computed(() => {
  const { rent } = modal.data
  if (modal.type === 'street') {
    let temp: IRent = { bought: false, count: 0 }
    for (const el of Object.values(rent) as IRent[]) {
      if (el.bought) temp = el
      else return temp.count
    }
    return temp.count
  }
  return rent[modal.count ? modal.count - 1 : 0]
})

const isRentColorBought = computed(() => {
  const { rent } = modal.data
  if (rent.length <= 4) return false
  return rent['2color'].bought
})

const pledgedTip = computed(() => (modal.data.isPledged ? modal.data.redemption : modal.data.pledge))
</script>
