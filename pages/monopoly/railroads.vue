<template>
  <section class="m-8">
    <ol class="relative border-l border-neutral">
      <li
        class="mb-4 ml-4 before:content-[''] before:absolute before:h-full before:w-px before:-left-px before:bg-warning"
        v-if="board.railroads"
      >
        <div class="absolute w-4 h-4 rounded-full mt-1.5 -left-[9px] border border-warning bg-warning"></div>
        <span class="mb-1 text-sm font-normal leading-none capitalize">Железные дороги</span>
        <div>
          <button
            class="btn btn-ghost btn-sm text-left mt-4 capitalize block"
            :class="{ 'line-through italic text-neutral-content/30': railroad.owner }"
            v-for="(railroad, idx) in board.railroads"
            @click="setModal(railroad, idx.toString(), 'railroad', checkOwned(railroad))"
            :key="idx"
          >
            {{ railroad.name }}
          </button>
        </div>
      </li>
    </ol>
  </section>
</template>

<script lang="ts" setup>
import type { Irailroads } from '@/types'
definePageMeta({ layout: 'monoplay' })

const { getOwnedUnpledgedCount } = useBoard()
const { setModal } = useModal()
const board = useBoard()

const checkOwned = (railroad: Irailroads) => {
  if (railroad.owner) return getOwnedUnpledgedCount(railroad.owner)
}
</script>
