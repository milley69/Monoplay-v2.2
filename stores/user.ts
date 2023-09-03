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
  },
  actions: {
    setStatus(status: authStatus) {
      this.authStatus = status
    },
    setUser(user: User) {
      this.user = user
      this.uid = user.uid
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
