import { combineReducers } from 'redux'

import { History } from 'history'
import { connectRouter, RouterState } from 'connected-react-router'
import { sessionReducer, SessionState } from './sessionReducer'
import { walletCreationReducer, WalletCreationState } from './walletCreationReducer'

export interface RootState {
  router: RouterState,
  session: SessionState,
  walletCreation: WalletCreationState
}

export const rootReducer = (history: History) => combineReducers({
  router: connectRouter(history),
  session: sessionReducer,
  walletCreation: walletCreationReducer,
})
