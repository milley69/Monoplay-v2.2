<template>
  <div class="btm-nav btm-nav-xs h-16 z-10">
    <nuxt-link
      v-for="link in isNavigate"
      :key="link.name"
      :to="link.path"
      class="flex flex-col justify-center items-center gap-1"
      exact-active-class="active"
      active-class="text-primary"
    >
      <i class="bx bx-fw pt-2 text-base-content" :class="link.iconClass"></i>
      <span class="btm-nav-label pt-2 text-base-content">{{ link.name }}</span>
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
const { isMain } = withDefaults(defineProps<{ isMain?: boolean }>(), { isMain: false })
const isNavigate = computed(() => (isMain ? navigateMain : navigate))

const navigate = [
  { path: '/monopoly/', name: 'Профиль', iconClass: 'bxs-user pl-1' },
  { path: '/monopoly/streets', name: 'Улицы', iconClass: 'bx-street-view pl-0.5' },
  { path: '/monopoly/railroads', name: 'ЖД', iconClass: 'bxs-train pl-0.5' },
  { path: '/monopoly/company', name: 'УК', iconClass: 'bxs-factory pl-px' },
]
const navigateMain = [
  { path: '/monopoly/', name: 'Игра', iconClass: 'bxs-dashboard pl-1' },
  { path: '/main', name: 'Главная', iconClass: 'bx-food-menu pl-1' },
  { path: '/main/settings', name: 'Настройки', iconClass: 'bx-cog pl-1' },
]
</script>
