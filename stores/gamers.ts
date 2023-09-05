import type { Gamer } from '@/types'
import { defineStore, storeToRefs } from 'pinia'

export const useGamers = defineStore('GamersPinia', {
  state: () => ({
    gamer: <Gamer>{},
    gamers: <Record<string, Gamer>>{},
  }),
  getters: {},
  actions: {
    setGamers(data: any) {
      const { uid } = storeToRefs(useUser())
      if (!uid.value) return
      const gamers = data
      this.gamer = gamers[uid.value]
      delete gamers[uid.value]
      this.gamers = gamers
    },
    getGamerById(id: string) {
      return this.gamers[id]
    },
  },
})
