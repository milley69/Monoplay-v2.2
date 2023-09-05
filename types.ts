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

// Store toast
export interface Toast {
  type: ToastType
  title: string
  message: string
  id: number
}

export type ToastType = 'error' | 'success' | 'info' | 'warning'
export type LossType = number | { house: number; hotel: number }

export interface Gamer {
  isBankrupt: boolean
  name: string
  uid: string
  money: number
}

/* Board */
export interface IRent {
  bought: boolean
  count: number
}

export interface IStreets {
  housePrice: number
  isPledged: boolean
  name: string
  owner?: string
  pledge: number
  price: number
  redemption: number
  rent: Record<string, IRent>[]
  color: string
  path: string
}
export interface Irailroads {
  isPledged: boolean
  name: string
  path: string
  owner?: string
  pledge: number
  price: number
  redemption: number
  rent: [number, number, number, number]
}
export interface Icompanies {
  isPledged: boolean
  name: string
  path: string
  owner?: string
  pledge: number
  price: number
  redemption: number
  rent: [string, string]
}
export interface IConfirm {
  by: string
  for: string
  cost: number
  name: any
  // path: PathDatabase
  path: string
  somePath: string
  check: boolean
  id: string
}

/* Modals types */

export interface Modal {
  data?: any
  path?: string
  type?: ModalType
  count?: number
}
export type ModalType = 'railroad' | 'company' | 'street'
