<template>
  <Transition appear @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <div
      class="fixed bottom-0 bg-base-content text-base-300 pb-4 w-full rounded-t-[2rem] flex justify-center"
      v-if="open"
    >
      <div class="absolute top-3 w-12 h-0.5 bg-base-100 mx-auto rounded cursor-pointer"></div>
      <form
        class="form-control w-full max-w-xs mt-6 space-y-4 px-4"
        :class="{ invisible: isLoader || isAuth }"
        @submit.prevent="() => (isSignUp ? signUpHandler() : signInHandler())"
      >
        <p class="text-center font-medium mb-2">Авторизоваться</p>
        <input
          type="text"
          v-model.trim="userForm.name"
          placeholder="Ваше имя"
          spellcheck="true"
          class="input input-bordered bg-base-200 text-base-content w-full max-w-xs"
          :class="{ hidden: !isSignUp, 'border-primary': !checkErrorName }"
        />
        <label class="label !my-0" v-if="!checkErrorName">
          <span class="text-sm text-primary">{{ errorForm.name }}</span>
        </label>
        <input
          type="email"
          v-model.trim="userForm.email"
          placeholder="Email"
          class="input input-bordered bg-base-200 text-base-content w-full max-w-xs"
          :class="{ 'border-primary': errorForm.email }"
        />
        <label class="label !my-0" v-if="errorForm.email">
          <span class="text-sm text-primary">{{ errorForm.email }}</span>
        </label>
        <div class="relative">
          <input
            :type="viewPassword ? 'text' : 'password'"
            v-model.trim="userForm.password"
            placeholder="Пароль"
            class="input input-bordered bg-base-200 text-base-content w-full max-w-xs"
            :class="{ 'border-primary': !checkErrorPass }"
          />
          <label class="label !my-0" v-if="!checkErrorPass">
            <span class="text-sm text-primary">{{ errorForm.password }}</span>
          </label>
          <i
            class="bx bx-show bx-sm text-base-content absolute right-2 inset-y-3 cursor-pointer"
            @click.stop.prevent="viewPassword = !viewPassword"
          ></i>
          <p class="text-sm pt-2 hover:underline cursor-not-allowed opacity-50" :class="{ invisible: signUp }">
            Забыли пароль?
          </p>
        </div>
        <button type="submit" class="btn hover:btn-primary">Продолжить</button>
        <div class="join inline-grid grid-cols-2 !mt-16">
          <input
            class="join-item btn btn-md"
            type="radio"
            name="auth"
            :checked="isSignUp"
            @change="isSignUp = !isSignUp"
            aria-label="Создать аккаунт"
          />
          <input
            class="join-item btn btn-md"
            type="radio"
            name="auth"
            :checked="!isSignUp"
            @change="isSignUp = !isSignUp"
            aria-label="Войти"
          />
        </div>
      </form>
      <div class="absolute top-1/2 -translate-y-1/2 text-center" :class="{ hidden: !isAuth }">
        <span class="mx-auto">{{ user?.name }}, с возвращением !</span>
        <div class="flex gap-4 mt-8">
          <button type="button" class="btn btn-ghost" @click="signOut">Выйти</button>
          <button type="button" class="btn" @click="push('/main')">Продолжить</button>
        </div>
      </div>
      <div class="absolute top-1/2 -translate-y-1/2" :class="{ hidden: !isLoader }">
        <LazyAppLoader />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
defineProps<{ open: boolean }>()

const { signIn, signUp, signOut } = useAuthFB()
const { isAuth, authStatus, user, errorForm } = storeToRefs(useUser())
const { push } = useRouter()
const { $gsap } = useNuxtApp()

const isLoader = computed(() => authStatus.value === 'loading')
const isSignUp = ref(false)
const viewPassword = ref(false)

const userForm = reactive({
  name: '',
  email: '',
  password: '',
})

const signInHandler = async () => {
  const data = useAuthValidator({ email: userForm.email, password: userForm.password }, 'signIn')
  if (!data) return
  const res = await signIn({ email: userForm.email, password: userForm.password, name: userForm.name })
  if (res) {
    push('/main')
    // localStorage.setItem('monoplay_user', JSON.stringify(user.value))
  }
}
const signUpHandler = async () => {
  const data = useAuthValidator({ email: userForm.email, password: userForm.password, name: userForm.name }, 'signUp')
  if (!data) return
  const res = await signUp({ email: userForm.email, password: userForm.password, name: userForm.name })
  if (res) {
    push('/main')
    // localStorage.setItem('monoplay_user', JSON.stringify(user.value))
  }
}

const checkErrorPass = computed(() => {
  if (errorForm.value.password && userForm.password.length < 8) return false
  return true
})
const checkErrorName = computed(() => {
  if (errorForm.value.name && userForm.name.length < 1 && isSignUp.value) return false
  return true
})

const beforeEnter = (el: any) => {
  el.style.opacity = 1
  el.style.transform = 'translateY(500px)'
}
const enter = (el: any, done: any) => {
  $gsap.to(el, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power4.out',
    onComplete: done,
  })
}
const leave = (el: any, done: any) => {
  $gsap.to(el, {
    y: 500,
    opacity: 1,
    duration: 1,
    ease: 'power4.in',
    onComplete: done,
  })
}
</script>
