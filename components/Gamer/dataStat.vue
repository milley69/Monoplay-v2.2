<template>
  <div class="grid transition-all duration-500 mt-2" :class="[action ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]']">
    <div class="overflow-hidden">
      <ol class="relative border-l border-neutral">
        <li
          class="mb-4 ml-4 before:content-[''] before:absolute before:h-full before:w-px before:-left-px before:bg-accent"
          v-if="getStreetsByUid(uid).length"
        >
          <div class="absolute w-4 h-4 rounded-full mt-1.5 -left-[9px] border border-accent bg-accent z-30"></div>
          <span class="mb-1 text-sm font-normal leading-none capitalize">Улицы</span>
          <div>
            <button
              class="btn btn-ghost btn-sm text-left mt-4 capitalize block"
              :class="{
                'btn-disabled': street.isPledged,
                'pointer-events-auto': street.owner === userUid,
              }"
              v-for="(street, idx) in getStreetsByUid(uid)"
              @click="setModal(street, street.path, 'street')"
              :key="idx"
            >
              <span
                class="relative after:content-[''] after:absolute after:w-3 after:h-3 after:bg-warning after:border after:!border-white after:rounded-full after:-top-1 after:translate-x-1"
                :class="street.color"
              >
                {{ street.name }}
              </span>
            </button>
          </div>
        </li>
        <li
          class="mb-4 ml-4 before:content-[''] before:absolute before:h-full before:w-px before:-left-px before:bg-warning"
          v-if="getRailroadsByUid(uid).length"
        >
          <div class="absolute w-4 h-4 rounded-full mt-1.5 -left-[9px] border border-warning bg-warning z-30"></div>
          <span class="mb-1 text-sm font-normal leading-none capitalize">Железные дороги</span>
          <div>
            <button
              class="btn btn-ghost btn-sm text-left mt-4 capitalize block"
              :class="{ 'btn-disabled': railroad.isPledged, 'pointer-events-auto': railroad.owner === userUid }"
              v-for="(railroad, idx) in getRailroadsByUid(uid)"
              @click="setModal(railroad, idx.toString(), 'railroad', getOwnedUnpledgedCount(uid, true))"
              :key="idx"
            >
              {{ railroad.name }}
            </button>
          </div>
        </li>
        <li
          class="mb-4 ml-4 before:content-[''] before:absolute before:h-full before:w-px before:-left-px before:bg-success"
          v-if="getCompaniesByUid(uid).length"
        >
          <div class="absolute w-4 h-4 rounded-full mt-1.5 -left-[9px] border border-success bg-success z-30"></div>
          <span class="mb-1 text-sm font-normal leading-none capitalize">Предприятия</span>
          <div>
            <button
              class="btn btn-ghost btn-sm text-left mt-4 capitalize block"
              :class="{ 'btn-disabled': company.isPledged, 'pointer-events-auto': company.owner === userUid }"
              v-for="(company, idx) in getCompaniesByUid(uid)"
              @click="setModal(company, idx.toString(), 'company', getOwnedUnpledgedCount(uid))"
              :key="idx"
            >
              {{ company.name }}
            </button>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Gamer } from '@/types'
import { storeToRefs } from 'pinia'

defineProps<{ action: boolean; gamer: Gamer; uid: string }>()

const { getRailroadsByUid, getCompaniesByUid, getOwnedUnpledgedCount, getStreetsByUid } = useBoard()
const { uid: userUid } = storeToRefs(useUser())
const { setModal } = useModal()
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
