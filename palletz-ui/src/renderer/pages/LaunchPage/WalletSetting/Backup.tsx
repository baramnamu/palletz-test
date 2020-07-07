import * as React from 'react'
import { Button } from 'antd'
import { useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import LaunchTitle from '../LaunchTitle'
import { t } from '../../../i18n'
import { StepContext } from '../../LaunchPageContext'

const Backup: React.FC = () => {

  const dispatch = useDispatch()
  const { step, setStep } = React.useContext(StepContext)

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name
    if (name === 'RESTORE') {
      dispatch(replace('/launch/wallet-setting/backup-sequence'))
    } else {
      setStep(step + 1)
      dispatch(replace('/launch/policy-admin/change-password'))
    }
  }

  return (
    <>
      <LaunchTitle main={'setup.ws.Restore.Title'} sub={'setup.ws.Restore.Subtitle'}/>
      <div className="launch-flex-column">
        <Button onClick={onClick} name={"RESTORE"} className="launch-default-container">
          {t('setup.ws.Restore.Btn.Backup')}
        </Button>
        <Button onClick={onClick} name={"NEW"} className="launch-default-container">
          {t('setup.ws.Restore.Btn.Without')}
        </Button>
      </div>
    </>
  )
}

export default Backup
