import {Action, ActionCreator} from 'redux'
import {LoginResponse} from '../api'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export interface LoginAction extends Action {
  type: typeof LOGIN,
  session: LoginResponse
}

export interface LogoutAction extends Action {
  type: typeof LOGOUT
}

export const login: ActionCreator<LoginAction> = (r: LoginResponse) => ({
  type: LOGIN,
  loggedIn: true,
  session: r
})
export const logout: ActionCreator<LogoutAction> = () => ({
  type: LOGOUT
})


export type SessionAction = LoginAction | LogoutAction
