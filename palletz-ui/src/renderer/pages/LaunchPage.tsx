import * as React from 'react'
import { Route } from 'react-router'
import SystemAdmin from './LaunchPage/SystemAdmin'
import WalletSetting from './LaunchPage/WalletSetting'
// import PolicyAdmin from './LaunchPage/PolicyAdmin'
// import SettingCompleted from './LaunchPage/SettingCompleted'
import LaunchSteps from './LaunchPage/LaunchSteps'
import './LaunchPage.scss'

import {
  AdminContext,
  defaultAdminInformation,
  defaultMnemonicInformation,
  defaultVerifyInformation,
  MnemonicContext,  
  VerifyContext
} from './LaunchPageContext'

const LaunchPage: React.FC = () => {
  const [info, setInfo] = React.useState<MnemonicInformation>(defaultMnemonicInformation)
  const [verify, setVerify] = React.useState<VerifyInformation>(defaultVerifyInformation)
  const [admin, setAdmin] = React.useState<AdminInformation>(defaultAdminInformation)

  return (
    <div className="launch-wrapper">
      <LaunchSteps/>    {/* 상단 Step Progress Bar 표시 */}
      <div className="launch-inner">
        <AdminContext.Provider value={{ admin, setAdmin }}>
          <VerifyContext.Provider value={{ verify, setVerify }}>
            <MnemonicContext.Provider value={{ info, setInfo }}>
              <Route path={`/launch/system-admin`} render={() => (<SystemAdmin/>)}/>
              <Route path={`/launch/wallet-setting`} render={() => (<WalletSetting/>)}/>
              {/* <Route path={`/launch/policy-admin`} render={() => (<PolicyAdmin/>)}/>
              <Route path={`/launch/setting-completed`} render={() => (<SettingCompleted/>)}/> */}
            </MnemonicContext.Provider>
          </VerifyContext.Provider>
        </AdminContext.Provider>
      </div>
    </div>
  )
}

export default LaunchPage
