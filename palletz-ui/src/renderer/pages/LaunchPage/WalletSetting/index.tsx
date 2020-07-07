import ChooseProcess from './ChooseProcess'
import * as React from 'react'
import { Route } from 'react-router'
import NewWallet from './NewWallet'
import Restoration from './Restoration'
import Backup from './Backup'
import BackupSequence from './BackupSequence'

const routes = [
  {
    path: 'choose-process', component: () => (
      <ChooseProcess/>)
  },
  {
    path: 'new', component: () => (
      <NewWallet/>)
  },
  {
    path: 'restoration', component: () => (
      <Restoration/>)
  },
  {
    path: `backup`,
    component: () => (
      <Backup />
    )
  },
  {
    path: `backup-sequence`,
    component: () => (
      <BackupSequence />
    )
  }
]

const WalletSetting: React.FC = () => {
  return (
    <>
      {routes.map((route, i) => (
        <Route
          path={`/launch/wallet-setting/${route.path}`}
          render={route.component}
          key={`WalletSetting${i}`}
        />
      ))}
    </>
  )
}

export default WalletSetting
