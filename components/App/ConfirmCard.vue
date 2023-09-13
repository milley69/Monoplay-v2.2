<template>
  <div
    v-show="!confirm.checked"
    ref="container"
    class="select-none relative flex items-center mx-4 justify-center overflow-hidden rounded-2xl"
    :style="{ height }"
  >
    <div class="flex justify-end w-full bg-primary">
      <button class="btn btn-error rounded-none w-1/4 text-lg" :style="{ height }" @click="$emit('denied', confirm)">
        <i class="bx bx-trash-alt bx-fw"></i>
      </button>
      <button class="btn btn-success rounded-none w-1/4 text-lg" :style="{ height }" @click="$emit('success', confirm)">
        <i class="bx bx-like bx-fw"></i>
      </button>
    </div>

    <div ref="target" class="absolute top-0 left-0 w-full !h-full" :class="{ bounce: isBounce }" :style="{ left }">
      <div ref="targetCard" class="card card-compact shadow-md bg-primary text-primary-content">
        <div class="card-body">
          <h2 class="card-title">{{ confirm.orderBy.name }} предлагает</h2>
          <p class="text-base">
            {{ confirmBy(confirm.orderFor, confirm.orderBy) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConfirmState } from '@/types'
import { useSwipe } from '@vueuse/core'
defineProps<{ confirm: ConfirmState; isBounce: boolean }>()
defineEmits<{
  (event: 'success', confirm: ConfirmState): void
  (event: 'denied', confirm: ConfirmState): void
}>()
const { confirmBy } = useConfirmation()

const container = ref<HTMLElement | null>(null)
const target = ref<HTMLElement | null>(null)
const targetCard = ref<HTMLElement | null>(null)

const containerWidth = computed(() => container.value?.offsetWidth)

const height = computed(() => targetCard.value?.clientHeight + 'px')

const left = ref('0')

const { lengthX } = useSwipe(target, {
  passive: false,
  onSwipe() {
    if (containerWidth.value && lengthX.value > 0) left.value = `${lengthX.value * -1}px`
    else left.value = '0'
  },
  onSwipeEnd() {
    if (lengthX.value > 0 && containerWidth.value && Math.abs(lengthX.value) / containerWidth.value >= 0.25)
      left.value = '-50%'
    else left.value = '0'
  },
})
</script>

<style scoped>
.bounce {
  animation: bounce 1s both;
  animation-delay: 0.3s;
}

@keyframes bounce {
  from,
  20%,
  53%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }

  40%,
  43% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translateX(-30px);
    transform: translateX(-30px);
  }

  70% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translateX(-15px);
    transform: translateX(-15px);
  }

  80% {
    -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }

  90% {
    -webkit-transform: translateX(-4px);
    transform: translateX(-4px);
  }
}
</style>
