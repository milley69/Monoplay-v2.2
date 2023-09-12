import type { User, UserPinia, authStatus } from '@/types'
import { defineStore } from 'pinia'

export const useUser = defineStore('UserPinia', {
  state: (): UserPinia => ({
    user: null,
    uid: '',
    authStatus: 'unauthenticated',
    errorForm: {
      name: '',
      email: '',
      password: '',
    },
  }),
  getters: {
    isAuth({ authStatus, uid, user }) {
      return authStatus === 'authenticated' && uid.length > 0 && user !== null
    },
    isUseRofls({ user }) {
      if (user) return user.useRofls
      return false
    },
  },
  actions: {
    setStatus(status: authStatus) {
      this.authStatus = status
    },
    setUser(user: User) {
      const { setRoom } = useRoom()
      this.user = user
      this.uid = user.uid
      if (user.room) setRoom(user.room)
      this.setStatus('authenticated')
    },
    removeUser() {
      this.user = null
      this.uid = ''
      this.setStatus('unauthenticated')
    },
    setError(to: 'name' | 'email' | 'password', error: string) {
      this.errorForm[to] = error
    },
    removeError() {
      this.errorForm = { name: '', email: '', password: '' }
    },
  },
})
