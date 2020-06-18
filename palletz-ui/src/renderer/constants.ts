import { createHash } from 'crypto'
import { replace } from 'connected-react-router'
import store from './store'
import { Dispatch } from 'redux'

export const InitLaunchURL = '/launch/system-admin/change-password'

export const makePin = (l: string, r: string) =>
  createHash('sha256').update(`${l}:${r}`).digest().slice(0, 8).reduce((acc: number[], val: number) => {
    acc.push(val)
    return acc
  }, [])

export const VelocityTypeMap: { [index: string]: string } = {
  ONETIME: '1 time',
  TIMEWINDOW_DAY: '1 Day',
  TIMEWINDOW_WEEK: '1 Week',
  TIMEWINDOW_MONTH: '1 Month'
}

export const roleUrlMap = {
  'SYSTEM_MANAGER': '/system-admin/manage-user',
  'POLICY_MANAGER': '/policy-manager/wallet-policy',
  'FINANCE_MANAGER': '/finance-manager/tx/progressing-draft'
}

export type UserRole = keyof typeof roleUrlMap

export const GotoDefaultPage = (dispatch: Dispatch<any>) => () => {
  const session = store.getState().session.session
  const url = session ? roleUrlMap[session.userRole] : InitLaunchURL
  dispatch(replace(url))
}

export const MAX_ELEMENTS = 0x7fffffff

export const PageTypesMap: KvMap<string> = {
  'GLOBAL_POLICY': 'Global Policy',
  'WALLET_POLICY': 'Wallet Policy',
  'WALLET': 'Wallet',
  'LOGIN_LOGOUT': 'Login/Logout'
}

export const EntropySizes: { [key: number]: [number, number] } = {
  128: [128, 49],
  192: [192, 73],
  256: [256, 97],
}
