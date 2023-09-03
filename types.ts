export interface UserPinia {
  user: User | null
  uid: string
  authStatus: authStatus
  errorForm: userForm
}

export interface User {
  email: string
  name: string
  useRofls: boolean
  createAt: Date
  uid: string
  room: number
}

export type userForm = Record<'name' | 'email' | 'password', string>
export type authStatus = 'authenticated' | 'unauthenticated' | 'loading'
