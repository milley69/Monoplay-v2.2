<template>
  <div class="grid transition-all duration-500 mt-2" :class="[action ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]']">
    <div class="overflow-y-hidden overflow-x-visible">
      <input
        type="text"
        :placeholder="name ? `${name} отдает` : 'Вы отдаете'"
        v-model.trim="money"
        :maxlength="maxMoney.toString().length"
        @input="validateMoney"
        class="input input-bordered bg-base-100 text-base-content w-[-webkit-fill-available] m-2 mb-4"
      />
      <ol class="relative border-l border-neutral">
        <li
          class="mb-4 ml-4 before:content-[''] before:absolute before:h-full before:w-px before:-left-px before:bg-accent"
          v-if="getStreetsByUid(uid).length"
        >
          <div class="absolute w-4 h-4 rounded-full -left-[9px] border border-accent bg-accent"></div>
          <span class="text-sm relative -top-1">Улицы</span>

          <label v-for="(street, idx) in getStreetsByUid(uid)" :key="idx">
            <p
              :class="street.color"
              class="btn btn-ghost btn-sm text-left mt-4 capitalize block relative after:content-[''] after:absolute after:w-3 after:h-3 after:border after:!border-white after:rounded-full after:right-2"
            >
              {{ street.name }}
              <input
                type="checkbox"
                class="checkbox checkbox-accent !bg-opacity-20 !bg-none absolute w-full left-0 h-8 -top-2 -z-10"
                @change="$emit('update:property', $event, street, 'street')"
              />
            </p>
          </label>
        </li>
        <li
          class="mb-4 ml-4 before:content-[''] before:absolute before:h-full before:w-px before:-left-px before:bg-warning"
          v-if="getRailroadsByUid(uid).length"
        >
          <div class="absolute w-4 h-4 rounded-full -left-[9px] border border-warning bg-warning z-30"></div>
          <span class="text-sm relative -top-1">Железные дороги</span>

          <label v-for="(railroad, idx) in getRailroadsByUid(uid)" :key="idx">
            <p class="btn btn-ghost btn-sm text-left mt-4 capitalize block relative">
              {{ railroad.name }}
              <input
                type="checkbox"
                class="checkbox checkbox-warning !bg-opacity-20 !bg-none absolute w-full left-0 h-8 -top-2 -z-10"
                @change="$emit('update:property', $event, railroad, 'railroad')"
              />
            </p>
          </label>
        </li>
        <li
          class="mb-4 ml-4 before:content-[''] before:absolute before:h-full before:w-px before:-left-px before:bg-success"
          v-if="getCompaniesByUid(uid).length"
        >
          <div class="absolute w-4 h-4 rounded-full -left-[9px] border border-success bg-success z-30"></div>
          <span class="text-sm relative -top-1">Предприятия</span>

          <label v-for="(company, idx) in getCompaniesByUid(uid)" :key="idx">
            <p class="btn btn-ghost btn-sm text-left mt-4 capitalize block relative">
              {{ company.name }}
              <input
                type="checkbox"
                class="checkbox checkbox-success !bg-opacity-20 !bg-none absolute w-full left-0 h-8 -top-2 -z-10"
                @change="$emit('update:property', $event, company, 'company')"
              />
            </p>
          </label>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ uid: string; maxMoney: number; action: boolean; name?: string }>()
const emit = defineEmits(['update:property', 'update:giving'])
const { getRailroadsByUid, getCompaniesByUid, getStreetsByUid } = useBoard()

const money = ref('')

const validateMoney = () => {
  const lastChar = money.value[money.value.length - 1]
  if (isNaN(Number(lastChar))) money.value = money.value.slice(0, -1)
  if (Number(money.value) > props.maxMoney) money.value = props.maxMoney.toString()
  emit('update:giving', money.value)
}
</script>

<style scoped>
.brown::after {
  background-color: #99582a;
  border-color: #99582a;
}
.lightBlue::after {
  background-color: #90e0ef;
  border-color: #90e0ef;
}
.pink::after {
  background-color: #bc00dd;
  border-color: #bc00dd;
}
.orange::after {
  background-color: #f77f00;
  border-color: #f77f00;
}
.red::after {
  background-color: #d90429;
  border-color: #d90429;
}
.yellow::after {
  background-color: #ffee32;
  border-color: #ffee32;
}
.green::after {
  background-color: #6a994e;
  border-color: #6a994e;
}
.blue::after {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}
</style>
