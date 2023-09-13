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
  room?: number
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

interface Property {
  isPledged: boolean
  name: string
  owner?: string
  path: string
  pledge: number
  price: number
  redemption: number
}

export interface IStreets extends Property {
  housePrice: number
  rent: Record<string, IRent>[]
  color: string
}
export interface Irailroads extends Property {
  rent: [number, number, number, number]
}
export interface Icompanies extends Property {
  rent: [string, string]
}

/* Modals types */

export interface Modal {
  data?: any
  path?: string
  type?: ModalType
  count?: number
}
export type ModalType = 'railroad' | 'company' | 'street'

/* Confirmation */

export interface PropertyConfirmation {
  uid: string
  name: string
  giving: string
  street: IStreets[]
  railroad: Irailroads[]
  company: Icompanies[]
}

export interface ConfirmState {
  orderBy: IConfirm
  orderFor: IConfirm
  checked: boolean
  id: number
}

export interface IConfirm {
  uid: string
  name: string
  giving?: string
  names: string[]
  paths: string[]
}
