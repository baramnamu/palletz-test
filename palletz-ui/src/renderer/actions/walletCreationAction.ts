import { Action } from 'redux'
import { UserResponse } from '../api'

export const STEP_DONE = 'wallet-creation/STEP_DONE'
export const CHANGE_STATE = 'wallet-creation/CHANGE_STATE'
export const ADD_WALLET_ADMIN = 'wallet-creation/ADD_WALLET_ADMIN'
export const REMOVE_WALLET_ADMIN = 'wallet-creation/REMOVE_WALLET_ADMIN'
export const ADD_APPROVAL_POLICY = 'wallet-creation/ADD_APPROVAL_POLICY'
export const REMOVE_APPROVAL_POLICY = 'wallet-creation/REMOVE_APPROVAL_POLICY'
export const PRODUCE_BUTTON = 'wallet-creation/PRODUCE_BUTTON'
export const CONSUME_BUTTON = 'wallet-creation/CONSUME_BUTTON'
export const RESET_STATE= 'wallet-creation/RESET_STATE'

export interface WalletCreationChangeStateAction extends Action {
  type: typeof CHANGE_STATE
  payload: any
}

export interface WalletCreationAddWalletAdmin extends Action {
  type: typeof ADD_WALLET_ADMIN
  walletAdmin: UserResponse
}

export interface WalletCreationRemoveWalletAdmin extends Action {
  type: typeof REMOVE_WALLET_ADMIN
  walletAdmin: UserResponse
}

export interface WalletCreationAddApprovalPolicy extends Action {
  type: typeof ADD_APPROVAL_POLICY
  walletAdmin: UserResponse
}

export interface WalletCreationRemoveApprovalPolicy extends Action {
  type: typeof REMOVE_APPROVAL_POLICY
  walletAdmin: UserResponse
}

export interface WalletCreationProduceButton extends Action {
  type: typeof PRODUCE_BUTTON
}

export interface WalletCreationConsumeButton extends Action {
  type: typeof CONSUME_BUTTON
}

export interface WalletCreationStepDone extends Action {
  type: typeof STEP_DONE
}

export interface WalletCreationResetState extends Action {
  type: typeof RESET_STATE
}

export type WalletCreationAction =
  WalletCreationChangeStateAction
  | WalletCreationAddWalletAdmin
  | WalletCreationRemoveWalletAdmin
  | WalletCreationAddApprovalPolicy
  | WalletCreationRemoveApprovalPolicy
  | WalletCreationProduceButton
  | WalletCreationConsumeButton
  | WalletCreationStepDone
  | WalletCreationResetState
