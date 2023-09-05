<template>
  <div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content fixed top-0 z-30">
      <div class="navbar w-screen bg-base-100/50 backdrop-blur-[10px]">
        <div class="navbar-start">
          <div class="flex-none">
            <label for="my-drawer" ref="headerLabel" class="btn btn-square btn-ghost drawer-button ml-2">
              <i class="bx bx-menu bx-fw bx-sm pt-px"></i>
            </label>
          </div>
        </div>
        <div class="navbar-center" v-if="whatIsPage">
          <p class="btn btn-ghost normal-case text-sm">{{ whatIsPage }}</p>
        </div>
        <div class="navbar-end" :class="{ invisible: isMain }">
          <p class="flex items-center gap-1">
            <i class="bx bx-won bx-flip-vertical"></i>{{ getCurrencyBalance(gamer?.money) }}
          </p>
          <Dice :uidprop="gamer.uid" is-navbar v-if="gamer.uid" />
        </div>
      </div>
    </div>
    <div class="drawer-side z-20">
      <label for="my-drawer" class="drawer-overlay"></label>
      <ul
        class="lg:w-56 h-full w-7/12 pt-20 bg-base-100 text-base-content flex justify-between items-center flex-col flex-wrap p-2"
      >
        <li class="mx-auto font-medium">
          <div class="indicator" v-if="!isMain">
            <span class="indicator-item badge badge-primary">{{ '0' }}</span>
            <button class="btn btn-ghost px-2">
              {{ user?.name }}
            </button>
          </div>
          <button class="btn btn-ghost px-2" v-else @click="toConfirmation">
            {{ user?.name }}
          </button>
        </li>
        <li class="mx-auto flex flex-col gap-4">
          <button type="button" class="btn btn-ghost" :disabled="!isYourDice" v-if="!isMain" @click="bankrupt">
            Обанкротиться
          </button>
          <button type="button" class="btn btn-ghost" @click="resetBoard" v-show="isAdmin || !isMain">Сбросить</button>
          <button type="button" class="btn btn-ghost translate-x-2 pr-3" v-if="!isMain" @click="router.push('/main')">
            На главную
            <i class="bx bx-food-menu bx-fw"></i>
          </button>
          <button type="button" class="btn btn-ghost translate-x-2 pr-3" @click="signOut">
            Выйти
            <i class="bx bx-log-out bx-fw"></i>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
withDefaults(defineProps<{ isMain?: boolean }>(), { isMain: false })

const router = useRouter()
const route = useRoute()
const { signOut } = useAuthFB()
const { resetBoard, onBankrupt } = useGame()

const { gamer } = storeToRefs(useGamers())
const { user } = storeToRefs(useUser())
const { isAdmin, title } = storeToRefs(useRoom())
const { isYourDice } = storeToRefs(useDice())

const drawerLabel = ref<HTMLElement | null>(null)

const bankrupt = () => {
  if (drawerLabel.value) {
    drawerLabel.value.click()
    onBankrupt(gamer.value.uid)
  }
}

const toConfirmation = () => {
  if (drawerLabel.value) {
    drawerLabel.value.click()
    router.push('/monopoly/confirmation')
  }
}

const getCurrencyBalance = (money: any): string => {
  if (!money) return '0'
  return money.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const whatIsPage = computed(() => {
  if (route.path === '/main') return 'Monoplay'
  if (route.path === '/main/settings') return 'Настройки'
  if (route.path.includes('/monopoly')) return title.value
  return null
})
</script>
