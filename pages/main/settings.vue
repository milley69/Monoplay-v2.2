<template>
  <section>
    <form class="form-control w-10/12 mt-4 mx-auto space-y-4" @submit.prevent="submitHandler">
      <div class="form-control">
        <label for="formName" class="label">
          <span class="label-text">Как вас звать ?</span>
        </label>
        <div class="relative flex justify-center items-center">
          <input
            type="text"
            id="formName"
            v-model.trim="form.name"
            placeholder="Имя"
            maxlength="18"
            required
            class="input input-bordered bg-base-100 input-warning text-base-content w-full"
          />
          <span class="absolute right-3 opacity-80">{{ `${form.name.length}/18` }}</span>
        </div>
      </div>
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">Включить посхалки</span>
          <input type="checkbox" v-model="form.useRofls" class="checkbox checkbox-warning" />
        </label>
      </div>
      <button type="submit" class="btn btn-warning">Сохранить</button>
    </form>
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

const { changeUserData } = useAuthFB()
const { setToast } = useToast()
const { user } = storeToRefs(useUser())
const form = reactive({
  name: user.value?.name ?? '',
  useRofls: user.value?.useRofls ?? false,
})

const submitHandler = async () => {
  const data = await changeUserData({ ...form })
  if (data && user.value) {
    user.value.name = form.name
    user.value.useRofls = form.useRofls
    setToast('success', 'Успех 🌟', `Сохранение прошло успешно!`)
  } else setToast('error', 'Упсс... 😕', `Не удалось сохранить данные!`)
}
</script>
