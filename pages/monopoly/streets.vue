<template>
  <section class="m-8">
    <ol class="relative border-l border-neutral">
      <li class="mb-4 ml-4" v-for="(street, color) in board.streets" :key="color">
        <div class="absolute w-4 h-4 rounded-full mt-1.5 -left-2 border" :class="removeNumber(color.toString())"></div>
        <span class="mb-1 text-sm font-normal leading-none capitalize">{{
          $translateIt(removeNumber(color.toString()))
        }}</span>
        <div v-for="(streetCity, idx) in street" :key="idx">
          <button
            class="btn btn-ghost btn-sm text-left mt-4 capitalize"
            :class="{ 'italic text-neutral-content/70': streetCity.owner }"
            @click="setModal(streetCity, `${color}/${idx}`, 'street')"
          >
            {{ streetCity.name }}
          </button>
        </div>
      </li>
    </ol>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'monoplay' })
const { setModal } = useModal()
const board = useBoard()
const { $translateIt } = useNuxtApp()

const removeNumber = (str: string): string => str.replace(/^[1-8]/, '')
</script>

<style scoped>
.brown {
  background-color: #99582a;
  border-color: #99582a;
}
.lightBlue {
  background-color: #90e0ef;
  border-color: #90e0ef;
}
.pink {
  background-color: #bc00dd;
  border-color: #bc00dd;
}
.orange {
  background-color: #f77f00;
  border-color: #f77f00;
}
.red {
  background-color: #d90429;
  border-color: #d90429;
}
.yellow {
  background-color: #ffee32;
  border-color: #ffee32;
}
.green {
  background-color: #6a994e;
  border-color: #6a994e;
}
.blue {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}
</style>
