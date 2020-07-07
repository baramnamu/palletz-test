import * as React from 'react'
import { Button } from 'antd'
import { useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import LaunchTitle from '../LaunchTitle'
import { t } from '../../../i18n'
import { StepContext, VerifyContext } from '../../LaunchPageContext'

const ChooseProcess: React.FC = () => {

  const dispatch = useDispatch()
  const { step, setStep } = React.useContext(StepContext)
  const { verify, setVerify } = React.useContext(VerifyContext)

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name
    setVerify({
      ...verify,
      sequence: name === 'NEW_WALLET' ? 'new' : 'restoration'
    })

    setStep(step + 1)
    if (name === 'NEW_WALLET') {
      dispatch(replace('/launch/wallet-setting/new/basic-setting'))
    } else {
      dispatch(replace('/launch/wallet-setting/restoration/basic-setting'))
    }
  }

  return (
    <>
      <LaunchTitle main={'setup.ws.Selection.Title'} sub={'setup.ws.Selection.Subtitle'}/>
      <div className="launch-flex-column">
        <Button onClick={onClick} name={"NEW_WALLET"} className="launch-default-container">
          {t('setup.ws.Selection.Btn.NewWallet')}
        </Button>
        <Button onClick={onClick} name={"OLD_WALLET"} className="launch-default-container">
          {t('setup.ws.Selection.Btn.OldWallet')}
        </Button>
      </div>
    </>
  )
}

export default ChooseProcess
