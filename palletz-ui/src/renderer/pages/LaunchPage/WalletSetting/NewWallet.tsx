import * as React from 'react'
import MasterKeyForm from '../MasterKeyForm'
import { Route } from 'react-router'
import Check from '../Mnemonic/Check'

const defaultPath = '/launch/wallet-setting/new'

const routes = [
  {
    path: `${defaultPath}/basic-setting`,
    component: () => (
      <MasterKeyForm title="setup.ws.BasicSetting.Title" subTitle="setup.ws.BasicSetting.Subtitle" />
    )
  },
  {
    path: `${defaultPath}/mnemonic-check`,
    component: () => (
      <Check />
    )
  }
]

const NewWallet = () => {
  return (
    <>
      {routes.map((route, i) => (
        <Route path={route.path} render={route.component} key={`NewWalletRoute${i}`} />
      ))}
    </>
  )
}

export default NewWallet
