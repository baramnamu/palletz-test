import React, { useCallback, useState } from 'react'
import StepButton, { StepExtraButtonType } from '../../components/StepButton'
import { t } from '../../i18n'
import { useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import {
  AdminContext,
  defaultAdminInformation,
  defaultMnemonicInformation,
  defaultVerifyInformation,
  MnemonicContext,
  StepContext,
  VerifyContext
} from '../LaunchPageContext'
import { InitLaunchURL } from '../../constants'

type Props = {
  onSubmit: (setLoading: (l: boolean) => void) => void,
  onPrev?: () => void,
  disabled?: boolean
}

const LaunchStepButton: React.FC<Props> = (props) => {

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const { setStep } = React.useContext(StepContext)
  const { setVerify } = React.useContext(VerifyContext)
  const { setAdmin } = React.useContext(AdminContext)
  const { setInfo } = React.useContext(MnemonicContext)

  const onCancel = () => {
    // Reset context
    setStep(0)
    setVerify(defaultVerifyInformation)
    setAdmin(defaultAdminInformation)
    setInfo(defaultMnemonicInformation)

    dispatch(replace(InitLaunchURL))
  }

  const extra: StepExtraButtonType[] | undefined = props.onPrev ? [{
    label: 'Previous',
    onClick: props.onPrev,
    type: 'danger'
  }] : undefined

  const onNext = useCallback(() => {
    props.onSubmit(setLoading)
  }, [props.onSubmit])

  return (
    <StepButton
      loading={loading}
      disabled={props.disabled}
      nextText={t('setup.common.Btn.Next')}
      onNext={onNext}
      cancelText={t('setup.common.Btn.RestartProcess')}
      onCancel={onCancel}
      style={{ width: '100%', left: 0 }}
      extra={extra}
    />
  )
}

export default LaunchStepButton
