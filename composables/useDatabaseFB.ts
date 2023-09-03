import { User } from 'firebase/auth'
import { get, set } from 'firebase/database'
import { storeToRefs } from 'pinia'

export const useDatabaseFB = () => {
  const { $ref } = useNuxtApp()
  const { user } = storeToRefs(useUser())

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
      // setToast('error', 'Ошибка', 'Не удалось получить пользователя!')
      console.log('error: ', error)
      return null
    }
  }

  return { setNewUserDatabase, getUserFromDatabase }
}
