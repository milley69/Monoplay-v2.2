<template>
  <input type="checkbox" :aria-label="'modal'" checked class="modal-toggle" />
  <div class="modal">
    <div class="modal-box max-w-xs" v-if="!isModalAgree.isOpen">
      <h3 class="text-lg font-bold">Обмен</h3>
      <div class="join w-full mt-2" @click="getSelf">
        <button class="join-item btn btn-ghost w-1/2">Вы</button>
        <button class="join-item btn btn-ghost w-1/2">
          <i :class="actions.self ? 'bx bx-up-arrow' : 'bx bx-down-arrow'"></i>
        </button>
      </div>

      <LazyModalConfirmationList
        :uid="gamerSelf.uid"
        :max-money="gamerSelf.money"
        :action="actions.self"
        @update:property="updatePropertySelf"
        @update:giving="
          (money) => {
            propertySelf.giving = money
          }
        "
      />

      <div class="divider my-0"></div>

      <div class="join w-full" @click="getGamer">
        <button class="join-item btn btn-ghost w-1/2">{{ gamer.name }}</button>
        <button class="join-item btn btn-ghost w-1/2">
          <i :class="actions.gamer ? 'bx bx-up-arrow' : 'bx bx-down-arrow'"></i>
        </button>
      </div>

      <LazyModalConfirmationList
        :uid="gamer.uid"
        :max-money="gamer.money"
        :action="actions.gamer"
        :name="gamer.name"
        @update:property="updatePropertyGamer"
        @update:giving="
          (money) => {
            propertyGamer.giving = money
          }
        "
      />

      <div class="divider my-0"></div>

      <div class="modal-action w-full">
        <button class="w-full btn btn-primary" @click="setOrder">Продолжить</button>
      </div>
    </div>
    <div class="modal-box max-w-xs space-y-4" v-else>
      <h3 class="text-lg font-bold">Обмен</h3>

      <p v-if="!isModalAgree.isSend">{{ isModalAgree.msg }}</p>
      <p v-else>{{ propertyGamer.name }} вскоре получит уведомление с Вашим предложением</p>

      <button class="btn btn-primary btn-outline w-full" v-if="!isModalAgree.isSend" @click="sendConfirmation">Подтверждаю</button>
      <button class="btn btn-primary btn-outline w-full" v-else @click="$emit('close')">Закрыть</button>
    </div>
    <div class="modal-backdrop backdrop-blur-[2px]" @click="$emit('close')"></div>
  </div>
</template>

<script setup lang="ts">
import type { Gamer, ModalType, PropertyConfirmation } from '@/types'
import { storeToRefs } from 'pinia'
const prop = defineProps<{ gamer: Gamer }>()
defineEmits(['close'])

const { setMessageForBy, sendConfirm } = useConfirmation()
const { setToast } = useToast()
const { removeTemp } = useConfirm()
const { gamer: gamerSelf } = storeToRefs(useGamers())

const actions = reactive({ self: false, gamer: false })

const getSelf = () => {
  actions.gamer = false
  actions.self = !actions.self
}
const getGamer = () => {
  actions.self = false
  actions.gamer = !actions.gamer
}

const propertySelf = reactive(<PropertyConfirmation>{
  uid: '',
  name: '',
  giving: '',
  street: [],
  railroad: [],
  company: [],
})
const propertyGamer = reactive(<PropertyConfirmation>{
  uid: '',
  name: '',
  giving: '',
  street: [],
  railroad: [],
  company: [],
})

onMounted(() => {
  propertySelf.uid = gamerSelf.value.uid
  propertySelf.name = gamerSelf.value.name
  propertyGamer.uid = prop.gamer.uid
  propertyGamer.name = prop.gamer.name
})

onUnmounted(() => {
  removeTemp()
})

const sendConfirmation = async () => {
  await sendConfirm()
  isModalAgree.value.isSend = true
}

const isModalAgree = ref({ isOpen: false, msg: '', isSend: false })

const setModalAgree = (msg: string) => (isModalAgree.value = { isOpen: true, msg, isSend: false })

const updatePropertySelf = (e: any, data: any, type: ModalType) => {
  const isChecked = e.target.checked

  if (isChecked) propertySelf[type].push(data)
  else {
    const idx = propertySelf[type].findIndex((p) => p.name === data.name)
    propertySelf[type].splice(idx, 1)
  }
}

const updatePropertyGamer = (e: any, data: any, type: ModalType) => {
  const isChecked = e.target.checked

  if (isChecked) propertyGamer[type].push(data)
  else {
    const idx = propertyGamer[type].findIndex((p) => p.name === data.name)
    propertyGamer[type].splice(idx, 1)
  }
}

const setOrder = () => {
  const res = setMessageForBy(propertySelf, propertyGamer)
  if (res) setModalAgree(res)
  else setToast('error', 'Предупреждение! 🐸', 'Вам следует выбрать хоть что то для обмена')
}
</script>
