<template>
  <div v-if="300 <= tempMoney && tempMoney < 500" @click="tempMoney = 0">
    <img
      src="https://i.giphy.com/media/QZmaQtVN7O3id6AS1a/giphy.webp"
      class="absolute mx-auto w-fit inset-x-0 top-0 mt-32 h-1/3"
      alt="rat dance"
    />
  </div>

  <div v-if="tempMoney >= 500" @click="tempMoney = 0">
    <img
      src="https://i.giphy.com/media/dvlGkaM3cePn16ngV8/giphy.webp"
      class="absolute mx-auto w-fit inset-x-0 bottom-12"
      alt="rat hold pizza"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ money: number }>(), { money: 0 })

const tempMoney = ref(0)

watch(
  () => props.money,
  (money) => {
    tempMoney.value = money
    setTimeout(() => {
      tempMoney.value = 0
    }, 2500)
  }
)
</script>
