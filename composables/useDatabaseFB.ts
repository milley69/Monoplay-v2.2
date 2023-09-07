import { IRent } from '@/types'
import { User } from 'firebase/auth'
import { child, get, set, update } from 'firebase/database'
import { storeToRefs } from 'pinia'

export const useDatabaseFB = () => {
  const { $ref } = useNuxtApp()
  const { setToast } = useToast()
  const { room } = storeToRefs(useRoom())
  const { setStreets, setRailroads, setCompanies } = useBoard()
  // const { user } = storeToRefs(useUser())

  const setNewUserDatabase = async (user: User, name: string) => {
    const data = {
      email: user.email,
      name,
      useRofls: false,
      createAt: user.metadata.creationTime,
      uid: user.uid,
    }
    try {
      await set($ref(`users/${user.uid}`), { ...data })
    } catch (error) {
      console.log('error: ', error)
    }
  }
  const getUserFromDatabase = async (uid: string) => {
    try {
      const data = (await get($ref(`users/${uid}`))).val()
      if (data) return data
    } catch (error) {
      setToast('error', 'Ошибка', 'Не удалось получить пользователя!')
      console.log('error: ', error)
      return null
    }
  }
  const getGamersFromDatabase = async (room: number) => {
    try {
      const data = (await get($ref(`games/${room}/gamers`))).val()
      if (data) return data
    } catch (error) {
      setToast('error', 'Ошибка', 'Не удалось получить пользователя!')
      console.log('error: ', error)
      return null
    }
  }

  const getStreetFromDatabase = async (): Promise<any | null> => {
    try {
      const streets = (await get($ref(`games/${room.value}/board/streets`))).val()
      if (streets) {
        setStreets(streets)
        return streets
      }
    } catch (error) {
      setToast('error', 'Ошибка', 'Улицы не получены!')
      console.log('error: ', error)
      return null
    }
  }
  const getRailroadsFromDatabase = async (): Promise<any | null> => {
    try {
      const railroads = (await get($ref(`games/${room.value}/board/railroads`))).val()
      if (railroads) {
        setRailroads(railroads)
        return railroads
      }
    } catch (error) {
      setToast('error', 'Ошибка', 'Железные дороги не получены!')
      console.log('error: ', error)
      return null
    }
  }
  const getCompanyFromDatabase = async (): Promise<any | null> => {
    try {
      const companies = (await get($ref(`games/${room.value}/board/companies`))).val()
      if (companies) {
        setCompanies(companies)
        return companies
      }
    } catch (error) {
      setToast('error', 'Ошибка', 'Компании не получены!')
      console.log('error: ', error)
      return null
    }
  }

  const getSmthByPath = async (room: number, path: string): Promise<any | null> => {
    try {
      const smth = (await get(child($ref(), `games/${room}/board/${path}`))).val()
      if (smth) return smth
    } catch (error) {
      console.log('error: ', error)
      return null
    }
  }

  const checkStreetLengthByPath = async (room: number, path: string): Promise<number> => {
    try {
      const data = (await get(child($ref(), `games/${room}/board/streets/${path}`))).val()
      if (data) return data.length
      return 0
    } catch (error) {
      setToast('error', 'Ошибка', 'Количество улицы не получены!')
      console.log('error: ', error)
      return 0
    }
  }

  const foldOtherRent = async (room: number, data: any, path: string, isBankrupt = false) => {
    const { rent } = data
    for await (const [key, value] of Object.entries(rent) as [string, IRent][]) {
      if (isBankrupt) await update($ref(`games/${room}/board/${path}/rent/1empty`), { bought: false })
      if (key === '1empty') continue
      if (value.bought) {
        await update($ref(`games/${room}/board/${path}/rent/${key}/`), { bought: false })
      }
    }
  }

  return {
    setNewUserDatabase,
    getUserFromDatabase,
    getSmthByPath,
    checkStreetLengthByPath,
    foldOtherRent,
    getGamersFromDatabase,
    getStreetFromDatabase,
    getRailroadsFromDatabase,
    getCompanyFromDatabase,
  }
}
