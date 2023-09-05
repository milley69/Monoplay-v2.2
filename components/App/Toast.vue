<template>
  <TransitionGroup name="list" tag="div">
    <div
      v-for="toast in reverseToast"
      :key="toast.id"
      ref="refToast"
      class="alert rounded-t-none flex shadow-lg fixed z-[1000] inset-x-0 top-0"
      :class="`alert-${toast.type}`"
      @click="toastStore.removeToast(toast)"
    >
      <div class="mx-auto">
        <h3 class="font-bold">{{ toast.title }}</h3>
        <p class="font-medium">{{ toast.message }}</p>
      </div>
    </div>
  </TransitionGroup>
</template>

<script lang="ts" setup>
const toastStore = useToast()

const reverseToast = computed(() => toastStore.toasts.slice().reverse())
</script>

<style>
.alert-info {
  border-color: hsl(var(--in) / 0.2);
  --tw-text-opacity: 1;
  color: hsl(var(--inc) / 1);
  color: hsl(var(--inc) / var(--tw-text-opacity));
  --alert-bg: hsl(var(--in));
  --alert-bg-mix: hsl(var(--b1));
}
.alert-error {
  border-color: hsl(var(--er) / 0.2);
  --tw-text-opacity: 1;
  color: hsl(var(--erc) / 1);
  color: hsl(var(--erc) / var(--tw-text-opacity));
  --alert-bg: hsl(var(--er));
  --alert-bg-mix: hsl(var(--b1));
}
.alert-success {
  border-color: hsl(var(--su) / 0.2);
  --tw-text-opacity: 1;
  color: hsl(var(--suc) / 1);
  color: hsl(var(--suc) / var(--tw-text-opacity));
  --alert-bg: hsl(var(--su));
  --alert-bg-mix: hsl(var(--b1));
}
.alert-warning {
  border-color: hsl(var(--wa) / 0.2);
  --tw-text-opacity: 1;
  color: hsl(var(--wac) / 1);
  color: hsl(var(--wac) / var(--tw-text-opacity));
  --alert-bg: hsl(var(--wa));
  --alert-bg-mix: hsl(var(--b1));
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-130px);
}
</style>
