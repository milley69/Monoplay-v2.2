<template>
  <input type="checkbox" aria-label="modalCreate" :checked="isOpen" class="modal-toggle" />
  <div class="modal" v-if="!loader">
    <div class="modal-box max-w-xs">
      <h3 class="text-lg font-bold">Поиск комнаты</h3>
      <form class="form-control w-full max-w-xs mt-4 space-y-4" @submit.prevent="submitHandler">
        <div class="form-control">
          <label class="label" for="formKey">
            <span class="label-text">Вам отправили ключ?</span>
          </label>
          <input
            type="text"
            id="formKey"
            v-model.number.trim="form.key"
            placeholder="Введите ключ"
            required
            class="input input-bordered bg-base-100 input-warning text-base-content w-full max-w-xs"
          />
        </div>

        <button type="submit" class="btn btn-warning">Искать</button>
      </form>
    </div>
    <div class="modal-backdrop backdrop-blur-[2px]" @click="emit('close')"></div>
  </div>
  <div class="modal" v-else>
    <div class="modal-box max-w-xs">
      <h3 class="text-lg font-bold">Поиск комнаты</h3>
      <div class="flex items-center justify-center my-12">
        <LazyAppLoader />
      </div>
    </div>
    <div class="modal-backdrop backdrop-blur-[2px]"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])
const { setToast } = useToast()

const { setNewGamer, loadRoom } = useGame()

const loader = ref(false)
const form = reactive({
  key: '',
})

const submitHandler = async () => {
  if (isNaN(Number(form.key))) {
    setToast('error', 'Ошибка! 🐸', 'Ключ состоит только из цифр!')
    form.key = ''
    return
  }
  loader.value = true
  const data = await loadRoom(Number(form.key), true)
  if (!data) {
    setToast('error', 'Ошибка! 🐸', 'Комнате не найдена!')
    loader.value = false
    return
  }

  setToast('success', 'Успех 🌟', `Вы вошли в комнату: <${data}>!`)
  loader.value = false
  await setNewGamer(Number(form.key))
  emit('close')
  navigateTo(`/monopoly/`)
}
</script>
