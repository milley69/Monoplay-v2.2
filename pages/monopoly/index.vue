<template>
  <section class="mx-auto">
    <div class="stats stats-vertical bg-primary text-primary-content scale-75">
      <div
        class="stat relative pb-0 border-opacity-50"
        :class="{ 'pointer-events-none bg-neutral text-base-content': gamer?.isBankrupt }"
      >
        <div class="stat-title text-neutral-content" v-if="!gamer?.isBankrupt">Ваш баланс</div>
        <div class="stat-title text-neutral-content" v-else>Банкрот</div>
        <div class="stat-value cursor-pointer" @click="getMyPanel" v-if="!gamer?.isBankrupt">
          <i class="bx bx-won bx-fw bx-flip-vertical"></i>{{ getCurrencyBalance(gamer?.money) }}
        </div>
        <div class="stat-value" v-else><i class="bx bx-won bx-fw bx-flip-vertical"></i>💸</div>
        <div class="stat-actions space-x-2">
          <button
            type="button"
            class="btn btn-sm btn-success"
            :class="{ 'btn-disabled': gamer?.isBankrupt }"
            @click="getEarnings"
          >
            Заработок
          </button>
          <button
            type="button"
            class="btn btn-sm btn-warning"
            :class="{ 'btn-disabled': gamer?.isBankrupt }"
            @click="getLoss"
          >
            Убыток
          </button>
        </div>
        <div
          class="grid transition-all duration-500"
          :class="[actions.earnings ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]']"
        >
          <div class="overflow-hidden flex flex-wrap gap-4 mt-4" v-if="chance.earnings.length">
            <button
              v-for="(action, idx) in chance.earnings"
              :key="idx"
              class="btn btn-success"
              @click="earningHandler(action)"
            >
              {{ action }}
            </button>
          </div>
        </div>
        <div class="grid transition-all duration-500" :class="[actions.loss ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]']">
          <div class="overflow-hidden flex flex-wrap gap-4 mt-4" v-if="chance.loss.length">
            <button
              type="button"
              v-for="(action, idx) in chance.loss"
              :key="idx"
              class="btn btn-warning"
              @click="lossHandler(action)"
            >
              {{ checkLossType(action) }}
            </button>
          </div>
        </div>
        <lazy-gamer-data-stat v-if="gamer" :gamer="gamer" :action="actions.myPanel" :uid="uid" />
        <lazy-dice :uidprop="uid" />
      </div>
      <lazy-gamer-stat-gamer
        v-for="(gamer, uid) in gamers"
        :key="uid"
        :gamer="gamer"
        :balance="getCurrencyBalance(gamer.money)"
        :uid="uid.toString()"
        @deposit="depositHandler"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { LossType } from '@/types'
import { storeToRefs } from 'pinia'

definePageMeta({ layout: 'monoplay', middleware: 'room' })

const { chance } = storeToRefs(useBoard())
const { uid } = storeToRefs(useUser())
const { gamer, gamers } = storeToRefs(useGamers())
const { setToast } = useToast()
const { onDeposit, onEarning, onLoss } = useGame()

const actions = reactive({
  earnings: false,
  loss: false,
  myPanel: false,
})

const checkLossType = (action: LossType) => {
  if (typeof action === 'number') return action
  if (typeof action === 'object') return `${action.house}~${action.hotel}`
}

const getEarnings = () => {
  actions.loss = false
  actions.myPanel = false
  actions.earnings = !actions.earnings
}
const getLoss = () => {
  actions.earnings = false
  actions.myPanel = false
  actions.loss = !actions.loss
}
const getMyPanel = () => {
  actions.earnings = false
  actions.loss = false
  actions.myPanel = !actions.myPanel
}

//
const earningHandler = async (sum: LossType) => {
  if (typeof sum === 'number') await onEarning(sum)
  // setToast('info', 'Внимание! 🔮', `Вам зачислено <${sum}> !`)
}
const lossHandler = async (sum: LossType) => {
  await onLoss(sum)
  if (typeof sum === 'number') setToast('info', 'Внимание! 💸', `С вас списано <${sum}> !`)
}

const depositHandler = async (money: number, uid: string, deposit: number): Promise<void> => {
  await onDeposit(money, uid, deposit)
}
//

const getCurrencyBalance = (money: any): string => {
  if (!money) return '0'
  return money.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>
