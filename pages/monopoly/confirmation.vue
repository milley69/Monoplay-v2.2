<template>
  <div class="h-screen pb-20 flex justify-center items-center" v-if="!confirmsLen">
    <div class="block space-y-8">
      <app-loader class="mx-auto" />
      <p class="block">Ожидаем каких либо предложений</p>
    </div>
  </div>
  <transition-group v-else tag="div" class="space-y-8 mt-4 mb-4" @before-enter="beforeEnter" @enter="enter">
    <lazy-app-confirm-card
      v-for="(confirm, idx) in confirms"
      :is-bounce="idx === 0"
      :confirm="confirm"
      :key="confirm.id"
      :data-index="idx + 1"
      v-show="!confirm.checked"
      @denied="onDenied"
      @success="onSuccess"
    />
  </transition-group>
</template>

<script setup lang="ts">
import { ConfirmState } from '@/types'
import { storeToRefs } from 'pinia'

definePageMeta({ layout: 'monoplay' })

const { $gsap } = useNuxtApp()
const { confirmSuccess, confirmDenied } = useConfirmation()
const { confirms, confirmsLen } = storeToRefs(useConfirm())

const show = ref(false)
onMounted(() => {
  show.value = true
})

const onDenied = async (confirm: ConfirmState) => {
  await confirmDenied(confirm)
}
const onSuccess = async (confirm: ConfirmState) => {
  await confirmSuccess(confirm)
  await onDenied(confirm)
}

const beforeEnter = (el: any) => {
  el.style.opacity = '0'
  el.style.transform = 'translateY(50px)'
}
const enter = (el: any, done: any) => {
  $gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    onComplete: done,
    delay: el.dataset.index * 0.15,
  })
}
</script>
