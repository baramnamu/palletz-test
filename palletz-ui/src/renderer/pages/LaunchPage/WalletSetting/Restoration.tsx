import * as React from 'react'
import { Route } from 'react-router'
import Check from '../Mnemonic/Check'
import MasterKeyForm from '../MasterKeyForm'

const defaultPath = '/launch/wallet-setting/restoration'

const routes = [
  {
    path: `${defaultPath}/basic-setting`,
    component: () => (
      <MasterKeyForm
        title="setup.ws.MnemonicCheck.SetupInfo.Title"
        subTitle="setup.ws.MnemonicCheck.SetupInfo.Subtitle"
      />
    )
  },
  {
    path: `${defaultPath}/mnemonic-confirm`,
    component: () => (
      <Check/>
    )
  }
]

const Restoration = () => {
  return (
    <>
      {routes.map((route, i) => (
        <Route path={route.path} render={route.component} key={`RestorationRoute${i}`}/>
      ))}
    </>
  )
}

export default Restoration
