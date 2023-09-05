import type { userForm } from '@/types'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { update } from 'firebase/database'

export const useAuthFB = () => {
  const { $auth, $ref } = useNuxtApp()
  const { setNewUserDatabase, getUserFromDatabase } = useDatabaseFB()
  const { removeUser, setStatus, setUser } = useUser()

  const signIn = async ({ email, password }: userForm): Promise<boolean> => {
    try {
      const data = await signInWithEmailAndPassword($auth, email, password)
      if (!data) return false
      initUser()
      return true
    } catch (error) {
      console.log('error: ', error)
      return false
    }
  }

  const signUp = async ({ email, password, name }: userForm): Promise<boolean> => {
    try {
      const data = await createUserWithEmailAndPassword($auth, email, password)
      if (!data) return false
      await setNewUserDatabase(data.user, name)
      initUser()
      return true
    } catch (error) {
      console.log('error: ', error)
      return false
    }
  }

  const signOut = async () => {
    await $auth.signOut()
    removeUser()
    useRouter().push('/')
  }

  const changeUserData = async ({ name, useRofls }: { name: string; useRofls: boolean }) => {
    const { uid } = useUser()
    try {
      await update($ref(`users/${uid}/`), { name, useRofls })
      return true
    } catch (error) {
      return false
    }
  }

  const initUser = async () => {
    onAuthStateChanged($auth, async (user) => {
      if (!user) return
      setStatus('loading')
      const userDB = await getUserFromDatabase(user.uid)
      if (userDB) {
        setUser(userDB)
        // setRoom(userDB.room)
      }
    })
  }

  return { signIn, signUp, signOut, changeUserData, initUser }
}
