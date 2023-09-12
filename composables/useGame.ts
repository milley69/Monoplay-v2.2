import type { LossType } from '@/types'
import { child, get, push, remove, set, update } from 'firebase/database'
import { storeToRefs } from 'pinia'

const extractSubstring = (str: string) => {
  const arrayTemp = str.split('/')
  arrayTemp.length = 3
  return arrayTemp.join('/')
}

export const useGame = () => {
  const dice = useDice()
  const { $ref } = useNuxtApp()
  const { user, uid } = storeToRefs(useUser())
  const { gamer } = storeToRefs(useGamers())
  const { getGamerById, setGamers } = useGamers()
  const { checkSimilarStreets, getForRenovation, foldRent, setFullBoard, getConfirmationModal } = useBoard()
  const { room, title, admin, edition } = storeToRefs(useRoom())
  const { setRoom, isValidRoom, deleteRoom: deleteRoomPinia } = useRoom()
  const { setToast } = useToast()
  const { getSmthByPath, foldOtherRent, checkStreetLengthByPath } = useDatabaseFB()

  const getCopyGame = async (edition: string | null) => {
    if (!edition) return null
    const data = await get(child($ref(), `editions/${edition}`))
    if (data.exists()) return data.val()
    return null
  }

  const createRoom = async (title: string, edition: string) => {
    if (!user.value) return null
    const id = Math.floor(Number(new Date()) * Math.random())
    try {
      const game = await getCopyGame(edition)
      if (!game) throw new Error('Копия игры не найдена')
      await set($ref(`games/${id}`), { id, title, board: { ...game }, admin: user.value.uid, edition })
      await setNewGamer(id)
    } catch (error) {
      console.log('error: ', error)
      return null
    }
    return { id, title }
  }

  const deleteRoom = async () => {
    const { gamers } = storeToRefs(useGamers())
    try {
      for await (const gamer of Object.values(gamers.value)) {
        remove($ref(`users/${gamer.uid}/room`))
      }
      remove($ref(`users/${uid.value}/room`))
      await remove($ref(`games/${room.value}`))
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const setNewGamer = async (room: number) => {
    if (!user.value) return null
    await update($ref(`users/${user.value.uid}`), { room })
    user.value.room = room
    setRoom(room)

    await set($ref(`games/${room}/gamers/${user.value.uid}`), {
      name: user.value.name,
      uid: user.value.uid,
      isBankrupt: false,
      money: 1500,
    })
  }

  const loadRoom = async (room: number, isSearch = false) => {
    try {
      const data = (await get(child($ref(), `games/${room}/`))).val()
      if (isSearch && data) return data.title
      if (data) {
        setFullBoard(data.board)
        admin.value = data.admin
        title.value = data.title
        edition.value = data.edition
        setGamers(data.gamers)
        return data.title
      }
    } catch (error) {
      console.log('error: ', error)
      return false
    }
  }

  const leaveFromRoom = async (isAdmin: boolean): Promise<void> => {
    if (isAdmin) {
      useToast().setToast('error', 'Ой... 🐱', 'Вы не можете покинуть свою комнату!', 4000)
      return
    }
    try {
      await onBankrupt(uid.value, true)
      await remove($ref(`games/${room.value}/gamers/${uid.value}`))
      deleteRoomPinia()
      setToast('info', 'Новое сообщение! 🐱', 'Вы удачно вышли из комнаты')
      setTimeout(() => window.location.reload(), 50)
    } catch (error) {
      console.log('error: ', error)
      setToast('info', 'Новое сообщение! 🐸', 'Вы не удачно вышли из комнаты')
    }
  }
  /* old func */

  const checkBalance = (cost: number): boolean => {
    if (gamer.value && gamer.value.money < cost) {
      setToast('error', 'Упсс 📉', `У вас недостаточно средств!`)
      return false
    }
    return true
  }

  const onDeposit = async (money: number, id: string, sum: number) => {
    if (!checkBalance(sum) && !isValidRoom) return
    await update($ref(`games/${room.value}/gamers/${id}`), { money: money + sum })
    await onLoss(sum)
  }
  const onEarning = async (sum: number) => {
    if (!isValidRoom) return
    await update($ref(`games/${room.value}/gamers/${uid.value}`), { money: gamer.value.money + sum })
  }
  const onLoss = async (sum: LossType) => {
    if (!isValidRoom) return
    if (typeof sum === 'object') {
      onLossRenovation(sum)
      return
    }
    await update($ref(`games/${room.value}/gamers/${uid.value}`), { money: gamer.value.money - sum })
  }
  const onLossRenovation = async (sum: { house: number; hotel: number }): Promise<void> => {
    if (!isValidRoom) return
    const { house, hotel } = getForRenovation(uid.value)
    await onLoss(house * sum.house + hotel * sum.hotel)
    setToast(
      'success',
      'Благодарность 🎉',
      `Вы заплатили за ремонт домов <${house * sum.house}> и за отели <${hotel * sum.hotel}>!`,
      5500
    )
  }

  const onPay = async (id: string, rent: number) => {
    if (!checkBalance(rent)) return null
    const gamer = getGamerById(id)
    await onDeposit(gamer.money, id, rent)
    return gamer.name
  }

  const buySmth = async (path: string, id: string, cost: number): Promise<void> => {
    if (!checkBalance(cost) || !room.value) return
    await update($ref(`games/${room.value}/board/${path}`), { owner: id })

    if (path.includes('streets')) {
      await update($ref(`games/${room.value}/board/${path}/rent/1empty/`), { bought: true })
      const { isSimilar, pathKey } = checkSimilarStreets(path.replace('streets/', '').slice(0, -2))
      await reloadBoughtColor(isSimilar, pathKey)
    }
    await onLoss(cost)

    const res = await getSmthByPath(room.value, path)
    setToast('success', 'Поздравляем 🎉', `Вы приобрели <${res.name}>!`)
  }

  const resetBoard = async () => {
    const { gamers } = useGamers()
    try {
      const game = await getCopyGame(edition.value)
      if (!game) throw new Error('Копия игры не найдена')
      Object.values(gamers).forEach(async (g) => {
        await update($ref(`games/${room.value}/gamers/${g.uid}`), { money: 1500, isBankrupt: false })
      })
      await update($ref(`games/${room.value}/gamers/${uid.value}`), { money: 1500, isBankrupt: false })
      await update($ref(`games/${room.value}/board`), { ...game })
      await remove($ref(`games/${room.value}/dice`))
    } catch (error) {
      setToast('error', 'Ошибка', 'Базу данных не удалось сбросить!')
      console.log('error: ', error)
    }
  }

  const pledgedSmth = async (path: string, cost: number, housePrice?: number) => {
    if (!room.value) return
    try {
      await update($ref(`games/${room.value}/board/${path}`), { isPledged: true })
      const res = await getSmthByPath(room.value, path)
      if (housePrice) {
        const { isSimilar, pathKey } = checkSimilarStreets(path.replace('streets/', '').slice(0, -2))
        await reloadBoughtColor(isSimilar, pathKey)
        const fold = foldRent(res.rent)
        foldOtherRent(room.value, res, path)
        await onEarning(housePrice * fold)
      }
      await onEarning(cost)
      setToast('success', 'Поздравляем 🎉', `Вы заложили <${res.name}>!`)
    } catch (error) {
      setToast('error', 'Ошибка', 'Не удалось заложить!')
      console.log('error: ', error)
    }
  }

  const redemptionSmth = async (path: string, cost: number) => {
    if (!checkBalance(cost) || !room.value) return
    await update($ref(`games/${room.value}/board/${path}`), { isPledged: false })
    if (path.includes('streets')) {
      const { isSimilar, pathKey } = checkSimilarStreets(path.replace('streets/', '').slice(0, -2))
      await reloadBoughtColor(isSimilar, pathKey)
    }
    await onLoss(cost)
    const res = await getSmthByPath(room.value, path)
    setToast('success', 'Поздравляем 🎉', `Вы выкупили <${res.name}>!`)
  }

  const reloadBoughtColor = async (isSimilar: boolean, path: string) => {
    if (!room.value) return
    const streetslength = await checkStreetLengthByPath(room.value, path)
    for (let i = 0; i < streetslength; i++) {
      await update($ref(`games/${room.value}/board/streets/${path}/${i}/rent/2color/`), { bought: isSimilar })
    }
  }

  const onPurchase = async (path: string, cost: number) => {
    if (!checkBalance(cost) || !room.value) return
    await update($ref(`games/${room.value}/board/${path}`), { bought: true })
    await onLoss(cost)
    const build = path.includes('hotel') ? 'отель' : 'дом'
    const res = await getSmthByPath(room.value, extractSubstring(path))
    setToast('success', 'Успех 🍀', `Вы приобрели ${build} в <${res.name}>!`)
  }

  const onSale = async (path: string, cost: number) => {
    if (!checkBalance(cost) || !room.value) return
    await update($ref(`games/${room.value}/board/${path}`), { bought: false })
    await onEarning(cost)
    const build = path.includes('hotel') ? 'отель' : 'дом'
    const res = await getSmthByPath(room.value, extractSubstring(path))
    setToast('success', 'Успех 🍀', `Вы продали ${build} в <${res.name}>!`)
  }

  const onOrder = async (path: string, id: string, cost: number) => {
    if (!room.value) return
    const { money, name } = getGamerById(id)

    if (cost !== 0) await onDeposit(money, id, cost * -1)
    await update($ref(`games/${room.value}/board/${path}`), { owner: id })
    if (path.includes('streets')) {
      const { isSimilar, pathKey } = checkSimilarStreets(path.replace('streets/', '').slice(0, -2))
      await reloadBoughtColor(isSimilar, pathKey)
    }

    const res = await getSmthByPath(room.value, extractSubstring(path))
    if (cost === 0) setToast('success', 'Успех 🎁', `${name} получил в подарок <${res.name}>!`)
    else setToast('success', 'Успех 💰', `${name} получил <${res.name}>!`)
  }

  const onBankrupt = async (uid: string, leave: boolean = false) => {
    const { getStreetsByUid, getRailroadsByUid, getCompaniesByUid } = useBoard()
    if (!leave) await update($ref(`games/${room.value}/gamers/${uid}`), { money: 0, isBankrupt: true })
    await dice.removeDice()
    const streets = getStreetsByUid(uid)
    const railroads = getRailroadsByUid(uid)
    const companies = getCompaniesByUid(uid)
    if (streets.length) {
      streets.forEach(async (street) => {
        await update($ref(`games/${room.value}/board/streets/${street.path}`), { owner: '', isPledged: false })
        if (room.value) await foldOtherRent(room.value, street, `streets/${street.path}`, true)
      })
    }
    if (railroads.length) {
      railroads.forEach(async (rail) => {
        await update($ref(`games/${room.value}/board/railroads/${rail.path}`), { owner: '', isPledged: false })
      })
    }
    if (companies.length) {
      companies.forEach(async (company) => {
        await update($ref(`games/${room.value}/board/companies/${company.path}`), { owner: '', isPledged: false })
      })
    }
    if (!leave) setToast('info', 'Новое сообщение 💸', 'Мы сожалеем, что вам пришлось обанкротиться!', 5500)
  }

  /* Confirmation */

  const getConfirmation = async () => {
    try {
      const confirmation = (await get(child($ref(), `games/${room.value}/board/confirmation`))).val()
      if (confirmation) {
        getConfirmationModal(confirmation)
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const setConfirmation = async (idFor: string, cost: number, name: string, path: string) => {
    try {
      await push($ref(`games/${room.value}/board/confirmation`), {
        for: idFor,
        by: uid.value,
        cost,
        name,
        path,
        check: false,
      })
    } catch (error) {
      console.log('error: ', error)
    }
  }
  const removeConfirmation = async (id: string) => {
    try {
      await remove($ref(`games/${room.value}/board/confirmation/${id}`))
    } catch (error) {
      console.log('error: ', error)
    }
  }

  // Dice

  const getDicesDB = async () => {
    try {
      const data = (await get(child($ref(), `games/${room.value}/dice`))).val()
      if (data) dice.addDices(data)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const addDiceDB = async (uid: string) => {
    if (dice.checkDice(uid)) return
    try {
      await set($ref(`games/${room.value}/dice/${dice.getSize}`), uid)
      setToast('info', 'Внимание 🌟', `Вы будете ходить ${dice.getSize}!`)
    } catch (error) {
      console.log('error: ', error)
      setToast('error', 'Упсс ♿', `Вы не будете ходить!`)
    }
  }
  const removeDiceDB = async () => {
    try {
      await remove($ref(`games/${room.value}/dice/${dice.getSize}`))
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const reloadDiceDB = async (data: string[]) => {
    try {
      await update($ref(`games/${room.value}/dice`), { ...data })
    } catch (error) {
      console.log('error: ', error)
    }
  }

  return {
    createRoom,
    setNewGamer,
    loadRoom,
    deleteRoom,
    leaveFromRoom,
    checkBalance,
    onDeposit,
    onEarning,
    onLoss,
    onPay,
    buySmth,
    resetBoard,
    pledgedSmth,
    redemptionSmth,
    reloadBoughtColor,
    onPurchase,
    onSale,
    onOrder,
    onBankrupt,
    /* Confirmation */
    getConfirmation,
    setConfirmation,
    removeConfirmation,
    /* Dice */
    addDiceDB,
    removeDiceDB,
    reloadDiceDB,
    getDicesDB,
  }
}
