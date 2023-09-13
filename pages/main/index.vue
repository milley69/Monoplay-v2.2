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
    <AppChat
      path="/images/favicon.ico"
      alt="chat-avatar"
      direction="left"
      chat-bg="chat-bubble-warning"
      v-if="!isValidRoom"
    >
      <button class="btn btn-ghost h-full px-px mb-1 btn-sm text-xs" @click="openModalJoin = !openModalJoin">
        Или присоединиться к уже созданной комнате
      </button>
    </AppChat>
    <AppChat path="/images/favicon.ico" alt="chat-avatar" direction="left" chat-bg="chat-bubble-warning" v-if="title">
      <button class="btn btn-ghost h-full px-px mb-1 btn-sm text-xs" @click="openModalJoin = !openModalJoin">
        Например присоединиться к "{{ title }}"
      </button>
    </AppChat>
    <AppChat path="/images/favicon.ico" alt="chat-avatar" direction="left" chat-bg="chat-bubble-error" v-if="title">
      <button class="btn btn-ghost h-full px-px mb-1 btn-sm text-xs" @click="leaveFromRoom">
        Или покинуть эту комнату, но подумай о последствиях
      </button>
    </AppChat>
    <AppChat path="/images/favicon.ico" alt="chat-avatar" direction="left" chat-bg="chat-bubble-warning">
      <button class="btn btn-ghost h-full btn-sm mb-1 text-xs" @click="push('/main/settings')">
        Перейти в настройки
      </button>
    </AppChat>
    <AppChat path="/images/favicon.ico" alt="chat-avatar" direction="left">
      <button class="btn btn-ghost h-full btn-sm mb-1 text-xs">Узнать об авторе ☕</button>
    </AppChat>
    <AppChat path="/images/favicon.ico" alt="chat-avatar" direction="left">
      <button class="btn btn-ghost h-full btn-sm mb-1 text-xs">Изменить пароль</button>
    </AppChat>
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

const { loadRoom } = useGame()

const openModalCreate = ref(false)
const openModalJoin = ref(false)

const { push } = useRouter()

const { isValidRoom, title, room } = storeToRefs(useRoom())
const { user } = storeToRefs(useUser())

onMounted(async () => {
  if (room.value) {
    const title = await loadRoom(room.value)
    if (!title) leaveFromRoom()
  }
})

watch(
  () => room.value,
  async (newRoom) => {
    if (newRoom) {
      const res = await loadRoom(newRoom, true)
      if (!res) leaveFromRoom()
      else title.value = res
    }
  }
)

const leaveFromRoom = () => {
  if (user.value) user.value.room = undefined
}
</script>
