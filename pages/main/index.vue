<template>
  <ModalCreate :is-open="openModalCreate" @close="openModalCreate = !openModalCreate" />
  <ModalJoin :is-open="openModalJoin" @close="openModalJoin = !openModalJoin" />
  <section class="mt-10 mx-4 group space-y-10">
    <AppChat path="/images/favicon.ico" alt="chat-avatar" direction="right" chat-bg="chat-bubble-info">
      <button class="btn btn-ghost h-full btn-xs text-xs">Что это за место?</button>
    </AppChat>
    <AppChat
      path="/images/favicon.ico"
      alt="chat-avatar"
      direction="left"
      chat-bg="chat-bubble-warning"
      v-if="!isValidRoom"
    >
      <button class="btn btn-ghost h-full px-px mb-1 btn-sm text-xs" @click="openModalCreate = !openModalCreate">
        Здесь ты можешь создать комнату
      </button>
    </AppChat>
    <AppChat path="/images/favicon.ico" alt="chat-avatar" direction="left" chat-bg="chat-bubble-warning">
      <button class="btn btn-ghost h-full px-px mb-1 btn-sm text-xs" @click="openModalJoin = !openModalJoin">
        {{
          !isValidRoom
            ? 'Или присоединиться к уже созданной комнате'
            : 'Здесь ты можешь присоединиться к уже созданной комнате'
        }}
      </button>
    </AppChat>
    <AppChat path="/images/favicon.ico" alt="chat-avatar" direction="left" chat-bg="chat-bubble-warning">
      <button class="btn btn-ghost h-full btn-sm mb-1 text-xs" @click="push('/main/settings')">
        Перейти в настройки
      </button>
    </AppChat>
    <AppChat path="/images/favicon.ico" alt="chat-avatar" direction="left">
      <button class="btn btn-ghost h-full btn-sm mb-1 text-xs">Изменить пароль, но это позже</button>
    </AppChat>
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

const openModalCreate = ref(false)
const openModalJoin = ref(false)
const { push } = useRouter()
const { isValidRoom } = storeToRefs(useRoom())
</script>
