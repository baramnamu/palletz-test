import {Reducer} from 'redux'
import {LOGIN, LOGOUT, SessionAction} from '../actions/sessionActions'
import {LoginResponse} from '../api'

export interface SessionState {
  readonly loggedIn: boolean,
  readonly session?: LoginResponse
}

const defaultState:SessionState = {
  loggedIn: false,
  session: undefined
}

export const sessionReducer: Reducer<SessionState> = (
  state:SessionState = defaultState,
  action: SessionAction
) => {
  switch (action.type) {
    case LOGIN:
      return { loggedIn: true, session: action.session }
    case LOGOUT:
      return { loggedIn: false }
    default:
      return state
  }
}
