import type { PropertyConfirmation } from '@/types'
import { set } from 'firebase/database'
import { storeToRefs } from 'pinia'

function confirmBy(self: IConfirm, gamer: IConfirm) {
  const isGivingBy = 'giving' in self
  const isGivingFor = 'giving' in gamer
  const isNamesBy = Boolean(self.names.length)
  const isNamesFor = Boolean(gamer.names.length)
  const orderByNames = self.names.map((name) => ' ' + name)
  const orderForNames = gamer.names.map((name) => ' ' + name)
  const gamerName = gamer.name

  if (isGivingBy && isGivingFor) {
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~ */
    switch (true) {
      case isNamesBy && isNamesFor:
        return `Вы платите ${self.giving} и отдаете${orderByNames}, а в замен ${gamerName} заплатит Вам ${gamer.giving} и отдаст${orderForNames}`
      case isNamesBy:
        return `Вы платите ${self.giving} и отдаете${orderByNames}, а в замен ${gamerName} заплатит Вам ${gamer.giving}`
      case isNamesFor:
        return `Вы платите ${self.giving}, а в замен ${gamerName} заплатит Вам ${gamer.giving} и отдаст${orderForNames}`
      default:
        return `Вы платите ${self.giving}, а ${gamerName} заплатит Вам ${gamer.giving}`
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~ */
  } else if (isGivingBy) {
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~ */
    switch (true) {
      case isNamesBy && isNamesFor:
        return `Вы платите ${self.giving} и отдаете${orderByNames}, а в замен ${gamerName} отдаст Вам${orderForNames}`
      case isNamesBy:
        return `${gamerName} получит ${self.giving} и${orderByNames}`
      case isNamesFor:
        return `Вы платите ${self.giving}, а ${gamerName} отдаст Вам ${orderForNames}`
      default:
        return false
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~ */
  } else if (isGivingFor) {
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~ */
    switch (true) {
      case isNamesBy && isNamesFor:
        return `Вы отдаете${orderByNames}, а ${gamerName} заплатит Вам ${gamer.giving} и отдаст${orderForNames}`
      case isNamesBy:
        return `Вы отдаете${orderByNames}, а ${gamerName} заплатит Вам ${gamer.giving}`
      case isNamesFor:
        return `${gamerName} платит Вам ${gamer.giving} и отдаст${orderForNames}`
      default:
        return false
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~ */
  } else if (!isGivingBy && !isGivingFor) {
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~ */
    switch (true) {
      case isNamesBy && isNamesFor:
        return `Вы отдаете${orderByNames}, а ${gamerName} отдаст Вам${orderForNames}`
      case isNamesBy:
        return `${gamerName} получит от Вас${orderByNames}`
      case isNamesFor:
        return `${gamerName} отдаст Вам${orderForNames}`
      default:
        return false
    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~ */
  } else return false
}

interface IConfirm {
  uid: string
  name: string
  giving?: string
  names: string[]
  paths: string[]
}
export const useConfirmation = () => {
  const { $ref } = useNuxtApp()
  const { temp } = storeToRefs(useConfirm())
  const { room } = storeToRefs(useRoom())
  const { setTemp } = useConfirm()

  const makeConfirm = (confirmFull: PropertyConfirmation) => {
    const confirm: IConfirm = { uid: '', name: '', names: [], paths: [] }

    confirm['uid'] = confirmFull.uid
    confirm['name'] = confirmFull.name

    if (confirmFull.giving) confirm['giving'] = confirmFull.giving
    if (confirmFull.street.length) {
      confirmFull.street.forEach((str) => {
        confirm.paths.push(`streets/${str.path}`)
        confirm.names.push(str.name)
      })
    }
    if (confirmFull.railroad.length) {
      confirmFull.railroad.forEach((rail) => {
        confirm.paths.push(`railroads/${rail.path}`)
        confirm.names.push(rail.name)
      })
    }
    if (confirmFull.company.length) {
      confirmFull.company.forEach((comp) => {
        confirm.paths.push(`companies/${comp.path}`)
        confirm.names.push(comp.name)
      })
    }
    return confirm
  }

  const setMessageForBy = (self: PropertyConfirmation, gamer: PropertyConfirmation) => {
    const orderBy = makeConfirm(self)
    const orderFor = makeConfirm(gamer)
    const res = confirmBy(orderBy, orderFor)
    if (res) {
      setTemp({ orderBy, orderFor, checked: false, id: Math.floor(Number(new Date()) * Math.random()) })
    }
    return res
  }

  const sendConfirm = async () => {
    if (!('orderFor' in temp.value)) return
    await set($ref(`games/${room.value}/gamers/${temp.value.orderFor.uid}/confirm/${temp.value.id}`), temp.value)
  }

  return { setMessageForBy, sendConfirm }
}
