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
      const { addConfirm } = useConfirm()
      if (!uid.value) return
      const gamers = data

      if ('confirm' in gamers[uid.value]) {
        addConfirm(gamers[uid.value]['confirm'])
        delete gamers[uid.value]['confirm']
      }

      this.gamer = gamers[uid.value]
      delete gamers[uid.value]

      for (const key in gamers) {
        if (Object.hasOwn(gamers, key) && 'confirm' in gamers[key]) delete gamers[key]['confirm']
      }

      this.gamers = gamers
    },
    getGamerById(id: string) {
      return this.gamers[id]
    },
  },
})
