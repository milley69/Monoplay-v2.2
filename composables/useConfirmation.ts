import type { ConfirmState, IConfirm, PropertyConfirmation } from '@/types'
import { remove, set, update } from 'firebase/database'
import { storeToRefs } from 'pinia'

export const useConfirmation = () => {
  const { $ref } = useNuxtApp()
  const { temp } = storeToRefs(useConfirm())
  const { room } = storeToRefs(useRoom())
  const { setTemp, checkConfirm } = useConfirm()
  const { getGamerById } = useGamers()

  const { checkSimilarStreets } = useBoard()
  const { reloadBoughtColor, onLoss, onEarning } = useGame()

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

  function confirmBy(self: IConfirm, gamer: IConfirm) {
    const isGivingBy = 'giving' in self
    const isGivingFor = 'giving' in gamer
    const isNamesBy = Boolean(self.names?.length)
    const isNamesFor = Boolean(gamer.names?.length)
    const orderByNames = isNamesBy ? self.names.map((name) => ' ' + name) : []
    const orderForNames = isNamesFor ? gamer.names.map((name) => ' ' + name) : []
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

  const confirmSuccess = async (confirm: ConfirmState) => {
    let { money: gamerMoney } = getGamerById(confirm.orderBy.uid)

    if ('paths' in confirm.orderBy)
      confirm.orderBy.paths.forEach(async (path) => {
        await update($ref(`games/${room.value}/board/${path}`), { owner: confirm.orderFor.uid })
        if (path.includes('streets')) {
          const { isSimilar, pathKey } = checkSimilarStreets(path.replace('streets/', '').slice(0, -2))
          await reloadBoughtColor(isSimilar, pathKey)
        }
      })
    if ('paths' in confirm.orderFor)
      confirm.orderFor.paths.forEach(async (path) => {
        await update($ref(`games/${room.value}/board/${path}`), { owner: confirm.orderBy.uid })
        if (path.includes('streets')) {
          const { isSimilar, pathKey } = checkSimilarStreets(path.replace('streets/', '').slice(0, -2))
          await reloadBoughtColor(isSimilar, pathKey)
        }
      })

    if ('giving' in confirm.orderFor) {
      await update($ref(`games/${room.value}/gamers/${confirm.orderBy.uid}`), {
        money: gamerMoney + Number(confirm.orderFor.giving),
      })
      gamerMoney = gamerMoney + Number(confirm.orderFor.giving)
      await onLoss(Number(confirm.orderFor.giving))
    }
    if ('giving' in confirm.orderBy) {
      await update($ref(`games/${room.value}/gamers/${confirm.orderBy.uid}`), {
        money: gamerMoney - Number(confirm.orderBy.giving),
      })
      await onEarning(Number(confirm.orderBy.giving))
    }
  }
  const confirmDenied = async (confirm: ConfirmState) => {
    await remove($ref(`games/${room.value}/gamers/${confirm.orderFor.uid}/confirm/${confirm.id}`))

    checkConfirm(confirm.id)
  }

  return { setMessageForBy, sendConfirm, confirmBy, confirmSuccess, confirmDenied }
}
