<template>
  <section class="m-8">
    <ol class="relative border-l border-neutral">
      <li
        class="mb-4 ml-4 before:content-[''] before:absolute before:h-full before:w-px before:-left-px before:bg-success"
        v-if="board.companies"
      >
        <div class="absolute w-4 h-4 rounded-full mt-1.5 -left-[9px] border border-success bg-success"></div>
        <span class="mb-1 text-sm font-normal leading-none capitalize">Предприятия</span>
        <div>
          <button
            class="btn btn-ghost btn-sm text-left mt-4 capitalize block"
            :class="{ 'italic text-neutral-content/70': company.owner }"
            v-for="(company, idx) in board.companies"
            @click="setModal(company, idx.toString(), 'company', checkOwned(company))"
            :key="idx"
          >
            {{ company.name }}
          </button>
        </div>
      </li>
    </ol>
  </section>
</template>

<script lang="ts" setup>
import type { Icompanies } from '@/types'

definePageMeta({ layout: 'monoplay' })

const { getOwnedUnpledgedCount } = useBoard()
const { setModal } = useModal()
const board = useBoard()

const checkOwned = (company: Icompanies) => {
  if (company.owner) return getOwnedUnpledgedCount(company.owner)
}
</script>
