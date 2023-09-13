import type { IRent, IStreets, Icompanies, Irailroads, LossType } from '@/types'
import { defineStore } from 'pinia'

type Street = Record<string, IStreets[]>
export const useBoard = defineStore('BoardPinia', {
  state: () => ({
    chance: { earnings: <LossType[]>[], loss: <LossType[]>[] },
    streets: <Street>{},
    railroads: <Irailroads[]>[],
    companies: <Icompanies[]>[],
  }),
  actions: {
    setFullBoard(data: any) {
      this.chance = data.chance
      this.companies = data.companies
      this.railroads = data.railroads
      this.streets = data.streets
    },
    setStreets(data: Street) {
      this.streets = data
    },
    setRailroads(data: Irailroads[]) {
      this.railroads = data
    },
    setCompanies(data: Icompanies[]) {
      this.companies = data
    },
    //
    getStreetsByUid(uid: string): IStreets[] {
      const streetsByUid: IStreets[] = []

      Object.values(this.streets).forEach((color) => {
        color.forEach((street) => {
          if (street.owner === uid) streetsByUid.push(street)
        })
      })
      return streetsByUid
    },

    getRailroadsByUid(uid: string): Irailroads[] {
      return this.railroads.filter((road) => road.owner && road.owner === uid)
    },
    getCompaniesByUid(uid: string): Icompanies[] {
      return this.companies.filter((company) => company.owner === uid)
    },
    getOwnedUnpledgedCount(id: any, isRail: boolean = false): number {
      if (isRail) return this.railroads.filter((i) => i.owner === id && !i.isPledged).length
      return this.companies.filter((i) => i.owner === id && !i.isPledged).length
    },
    //
    getForRenovation(uid: string) {
      let house = 0
      let hotel = 0
      for (const street of this.getStreetsByUid(uid)) {
        for (const rent in street.rent) {
          if (rent.includes('house') && street.rent[rent].bought) house += 1
          if (rent.includes('hotel') && street.rent[rent].bought) hotel += 1
        }
      }
      return { house, hotel }
    },
    foldRent(rent: Record<string, IRent>[]) {
      let fold = 0
      for (const [key, value] of Object.entries(rent)) {
        if ((key.includes('house') || key.includes('hotel')) && value.bought) fold += 1
      }
      return fold
    },
    checkSimilarStreets(pathKey: string) {
      const similarOwner = new Array()
      for (const street of Object.values(this.streets[pathKey])) {
        if (street.owner && !street.isPledged) {
          similarOwner.push(street.owner)
        } else {
          similarOwner.push(null)
        }
      }
      if (!similarOwner.includes(null)) {
        const isSimilar = similarOwner.every((el) => el === similarOwner[0])
        return { isSimilar, pathKey }
      }
      return { isSimilar: false, pathKey }
    },
  },
})
