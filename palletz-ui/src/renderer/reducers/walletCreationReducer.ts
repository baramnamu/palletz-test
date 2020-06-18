import { Reducer } from 'redux'
import {
  ADD_APPROVAL_POLICY,
  ADD_WALLET_ADMIN,
  CHANGE_STATE,
  REMOVE_APPROVAL_POLICY,
  REMOVE_WALLET_ADMIN,
  RESET_STATE,
  STEP_DONE,
  WalletCreationAction
} from '../actions/walletCreationAction'
import { UserResponse, WalletPolicySearchResponse } from '../api'
// import { ResultPageProps } from '../pages/PolicyManager/WalletCreationPage'

export interface WalletCreationState {
  coinType: string
  walletName: string
  walletAdmin: UserResponse[]
  approvalAdmin: UserResponse[]
  approvalNeedCount: number
  step: number
  // resultDsc: ResultPageProps
  mode: "COIN" | "TOKEN",
  selected?: WalletPolicySearchResponse
  tokenType: string
  // customToken: TokenInformation
}

const defaultState: WalletCreationState = {
  coinType: 'BTC',
  walletName: '',
  walletAdmin: [],
  approvalAdmin: [],
  approvalNeedCount: 0,
  step: 0,
  // resultDsc: {
  //   status: 'success',
  //   title: ''
  // },
  mode: 'COIN',
  tokenType: '',
  // customToken: {
  //   symbol: '',
  //   alias: '',
  //   baseCoin: '',
  //   contractAddress: '',
  //   precision: 1
  // }
}

export const walletCreationReducer: Reducer<WalletCreationState, WalletCreationAction> = (
  state = defaultState,
  action
) => {
  switch (action.type) {
    case CHANGE_STATE:
      return {
        ...state,
        ...action.payload
      }
    case ADD_WALLET_ADMIN:
      return {
        ...state,
        walletAdmin: state.walletAdmin.concat(action.walletAdmin)
      }
    case REMOVE_WALLET_ADMIN:
      return {
        ...state,
        walletAdmin: state.walletAdmin.filter(v => v.id !== action.walletAdmin.id)
      }
    case ADD_APPROVAL_POLICY:
      return {
        ...state,
        approvalNeedCount: state.approvalNeedCount === 0 ? 1 : state.approvalNeedCount,
        approvalAdmin: state.approvalAdmin.concat(action.walletAdmin),
        walletAdmin: state.walletAdmin.filter(v => v.id !== action.walletAdmin.id)
      }
    case REMOVE_APPROVAL_POLICY:
      return {
        ...state,
        approvalNeedCount: state.approvalNeedCount === 1 ? 0 : state.approvalNeedCount,
        approvalAdmin: state.approvalAdmin.filter(v => v.id !== action.walletAdmin.id),
        walletAdmin: state.walletAdmin.concat(action.walletAdmin)
      }
    case STEP_DONE:
      return {
        ...state,
        step: state.step + 1
      }
    case RESET_STATE:
      return {
        ...defaultState
      }
    default:
      return state
  }
}
