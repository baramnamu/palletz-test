import { createContext } from 'react'
import { EntropySizes } from '../constants'

export interface IStepContext {
  step: number,
  started: boolean
  setStep: (step: number) => void
  setStarted: (started: boolean) => void
}

export interface IMnemonicContext {
  info: MnemonicInformation
  setInfo: (o: MnemonicInformation) => void
}

export interface IVerifyContext {
  verify: VerifyInformation,
  setVerify: (o: VerifyInformation) => void
}

export interface IAdminContext {
  admin: AdminInformation,
  setAdmin: (o: AdminInformation) => void
}

export const defaultMnemonicInformation = {
  entropySize: EntropySizes[256],
  totalCount: 2,
  needCount: 2
}

export const defaultVerifyInformation: VerifyInformation = {
  code: '',
  verifyStep: 0,
  sequence: 'new',
  currentStep: 0
}

const defaultStepContext: IStepContext = {
  step: 0,
  started: false,
  setStep: () => {
  },
  setStarted: () => {

  }
}

const defaultMnemonicContext: IMnemonicContext = {
  info: {
    ...defaultMnemonicInformation
  },
  setInfo: () => {
  }
}

export const defaultAdminInformation: AdminInformation = {
  policy: {
    loginId: '',
    password: '',
    newPassword: '',
    uuid: ''
  },
  system: {
    loginId: '',
    password: '',
    newPassword: '',
    uuid: ''
  }
}

const defaultAdminContext: IAdminContext = {
  admin: {
    ...defaultAdminInformation
  },
  setAdmin: () => {
  }
}

const defaultVerifyContext: IVerifyContext = {
  verify: {
    ...defaultVerifyInformation
  },
  setVerify: () => {
  }
}

export const StepContext = createContext<IStepContext>(defaultStepContext)

export const MnemonicContext = createContext<IMnemonicContext>(defaultMnemonicContext)

export const VerifyContext = createContext<IVerifyContext>(defaultVerifyContext)

export const AdminContext = createContext<IAdminContext>(defaultAdminContext)
