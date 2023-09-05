<template>
  <ul class="steps steps-vertical mt-2" v-if="!purchase">
    <li
      v-for="(rent, idx) in rents"
      class="step text-sm cursor-pointer"
      :class="{
        'step-warning': compareRent(rent) && type === 'railroad',
        'step-success': compareRent(rent) && type === 'company',
        'step-info': rent.bought && type === 'street',
      }"
      :data-content="makeIcon(idx.toString())"
    >
      <span> Рента: {{ rent.count || rent }}<i class="bx bx-won pb-px bx-flip-vertical"></i> </span>
    </li>
  </ul>
  <ul class="steps steps-vertical mt-2" v-else>
    <li
      v-for="(rent, idx) in rents"
      class="step text-sm cursor-pointer"
      :class="{ 'step-info': rent.bought && type === 'street' }"
      :data-content="makeIcon(idx.toString())"
    >
      <label class="cursor-pointer select-none flex items-center relative">
        <input
          type="checkbox"
          v-model="tempRent[idx.toString()]"
          class="purchase-checkbox absolute -left-[38px] z-10 bg-black"
          :checked="rent.bought && type === 'street'"
          v-if="disableCheckBox(idx.toString())"
        />
        <span class="capitalize">{{ $translateIt(makeInfo(idx.toString())) }}</span>
      </label>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { IRent, TypeM } from 'types'
const { onPurchase, onSale } = useGame()
const { $translateIt } = useNuxtApp()
const { modal, closeModal } = useModal()

const props = withDefaults(
  defineProps<{ type: TypeM; rents: any; quantityRent: number | string; purchase: boolean }>(),
  { purchase: false }
)

onMounted(() => {
  for (const [key, value] of Object.entries(props.rents) as [string, IRent][]) {
    if (!disableCheckBox(key)) continue
    tempRent[key] = value.bought
  }
})

const tempRent: Record<string, boolean> = reactive({
  '3houseOne': false,
  '4houseTwo': false,
  '5houseThree': false,
  '6houseFour': false,
  '7hotel': false,
})

const handleRent = async () => {
  const { housePrice, path } = modal.data
  for await (const [key, val] of Object.entries(tempRent)) {
    const isItemBought = props.rents[key].bought
    if (val && !isItemBought) onPurchase(`streets/${path}/rent/${key}`, housePrice)
    if (!val && isItemBought) onSale(`streets/${path}/rent/${key}`, housePrice)
  }
  closeModal()
}

const disableCheckBox = (idx: string) => !(idx.includes('empty') || idx.includes('color'))

const makeInfo = (idx: string): string => {
  if (idx.includes('house')) return 'house'
  if (idx.includes('hotel')) return 'hotel'
  return ''
}

const compareRent = (rent: any) => {
  if (typeof props.quantityRent !== 'string') return props.quantityRent >= rent
  return Number(rent.substring(1)) <= Number(props.quantityRent.substring(1))
}

const makeIcon = (idx: string): string | null => {
  if (idx.includes('empty')) return '🌓'
  if (idx.includes('color')) return '🌕'
  const iconsHouse = ['🏠', '🏡', '🏢']
  if (idx.includes('house')) return iconsHouse[Math.floor(Math.random() * iconsHouse.length)]
  if (idx.includes('hotel')) return '🏩'
  return null
}
watch(
  () => props.purchase,
  (purc) => {
    if (!purc) {
      handleRent()
    }
  }
)
</script>
