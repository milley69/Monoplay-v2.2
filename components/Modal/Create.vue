<template>
  <input type="checkbox" aria-label="modalCreate" :checked="isOpen" class="modal-toggle" />
  <div class="modal" v-if="!loader">
    <div class="modal-box max-w-xs">
      <h3 class="text-lg font-bold">Создание комнаты</h3>
      <form class="form-control w-full max-w-xs mt-4 space-y-4" @submit.prevent="submitHandler">
        <div class="form-control">
          <label class="label" for="formName">
            <span class="label-text">Как назовем?</span>
          </label>
          <div class="relative flex justify-center items-center">
            <input
              type="text"
              id="formName"
              v-model.trim="form.name"
              maxlength="12"
              required
              class="input input-bordered bg-base-100 input-warning text-base-content w-full max-w-xs"
            />
            <span class="absolute right-3 opacity-80">{{ `${form.name.length}/12` }}</span>
          </div>
        </div>

        <button type="submit" class="btn btn-warning">Создать</button>
      </form>
    </div>
    <div class="modal-backdrop backdrop-blur-[2px]" @click="emit('close')"></div>
  </div>
  <div class="modal" v-else>
    <div class="modal-box max-w-xs">
      <h3 class="text-lg font-bold">Создание комнаты</h3>
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

const { createRoom } = useGame()

const loader = ref(false)
const form = reactive({
  name: '',
})

const submitHandler = async () => {
  loader.value = true
  const data = await createRoom(form.name)
  if (!data) {
    setToast('error', 'Очень жаль', `Комната <${form.name}> не создана!`)
    loader.value = false
    return
  }
  setToast('success', 'Успех 🌟', `Комната <${data.title}> создана!`)
  loader.value = false
  emit('close')
  navigateTo(`/monopoly/`)
}
</script>
