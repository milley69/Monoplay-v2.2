<template>
  <div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content fixed top-0 z-30">
      <div class="navbar w-screen bg-base-100/50 backdrop-blur-[10px]">
        <div class="navbar-start">
          <div class="flex-none">
            <label for="my-drawer" ref="drawerLabel" class="btn btn-square btn-ghost drawer-button ml-2">
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
          <LazyDice :uidprop="gamer.uid" is-navbar v-if="gamer.uid" />
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
            <button class="btn btn-ghost px-2" @click="toConfirmation">
              {{ user?.name }}
            </button>
          </div>
          <button class="btn btn-ghost px-2" v-else>
            {{ user?.name }}
          </button>
        </li>
        <li class="w-full">
          <ul class="menu rounded-box" v-if="!isMain">
            <div v-if="isAdmin">
              <li class="menu-title">Админ</li>
              <li class="mt-1 mb-3">
                <span>Закрыть комнату <i class="bx bx-lock-alt bx-fw"></i></span>
              </li>
              <li @click="resetBoard">
                <span>Сбросить<i class="bx bx-reset bx-fw"></i></span>
              </li>
              <li><div class="divider"></div></li>
            </div>
            <li :class="{ disabled: !isYourDice }" @click="bankrupt">
              <span>Обанкротиться<i class="bx bx-ghost bx-fw"></i></span>
            </li>
            <li><div class="divider"></div></li>
            <li @click="router.push('/main')">
              <span>На главную <i class="bx bx-food-menu bx-fw"></i></span>
            </li>
            <li><div class="divider"></div></li>
            <li :class="{ disabled: isAdmin }" @click="leave">
              <span>Покинуть комнату<i class="bx bx-run bx-fw"></i></span>
            </li>
            <li><div class="divider"></div></li>
            <li @click="signOut">
              <span>Выйти <i class="bx bx-log-out bx-fw"></i></span>
            </li>
          </ul>
          <ul class="menu rounded-box" v-else>
            <li @click="signOut">
              <span>Выйти <i class="bx bx-log-out bx-fw"></i></span>
            </li>
          </ul>
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
const { setToast } = useToast()

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

const leave = () => {
  if (isAdmin.value) {
    setToast('error', 'Ой... 🐱', 'Вы не можете покинуть свою группу!', 4000)
    return
  }
  console.log('oks')
}
</script>
