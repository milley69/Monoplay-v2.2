<template>
  <section class="hero min-h-screen">
    <div class="hero-content text-center" @click="authModal = false">
      <div class="max-w-md">
        <img
          class="w-5/6 object-cover object-center rounded mx-auto"
          alt="hero"
          fetchpriority="high"
          src="/images/Logo.png"
        />
        <h1 class="text-5xl font-bold">{{ greeting }}</h1>
        <p class="py-6">
          Присоединяйтесь к игре в Монополию, но сначала пожалуйста авторизуйтесь, чтобы мы могли начать игру.
        </p>
        <button type="button" class="btn btn-primary" @click.stop.prevent="push('/main')" v-if="isAuth">
          Продолжить
        </button>
        <button type="button" class="btn btn-primary" @click.stop.prevent="authModal = true" v-else>
          Авторизоваться
        </button>
      </div>
    </div>
  </section>
  <AppAuthForm :open="authModal" />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
definePageMeta({ layout: 'start-page' })

const { isAuth } = storeToRefs(useUser())
const { push } = useRouter()

const authModal = ref(false)

const phrases = ['Hola', 'Zdrasti', 'Hello ', 'Salut ', 'Shalom ', 'Salaam', 'Bonjour', 'Привет']
const greeting = computed(() => phrases[Math.floor(Math.random() * phrases.length)])
</script>

<style scoped></style>
