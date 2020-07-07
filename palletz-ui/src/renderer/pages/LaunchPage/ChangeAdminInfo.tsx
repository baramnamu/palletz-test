import * as React from 'react'
import { Button, Form, Icon, Input } from 'antd'
import { t } from '../../i18n'
import { AdminContext, StepContext } from '../LaunchPageContext'
import { useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'

type Props = {
  type: 'systemadmin' | 'policyadmin'
}

type ChangeAdminInfoType = {
  loginId: ValidationStatus,
  newPassword: ValidationStatus,
  confirmPassword: ValidationStatus
}

const passwordStrengthTest = (p: string): boolean =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{10,}$/.test(p)

const ChangeAdminInfo: React.FC<Props> = (props) => {

  const [touched, setTouched] = React.useState(false)
  const [fb, setFB] = React.useState<ChangeAdminInfoType>({
    loginId: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [help, setHelp] = React.useState<string>('')
  const [loginId, setLoginId] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const hasError = Object.values(fb).some(v => v.length !== 0)

  const validation = () => {
    const fb: ChangeAdminInfoType = {
      loginId: '',
      newPassword: '',
      confirmPassword: ''
    }
    let help = ''

    if (loginId !== props.type) {
      help = t('setup.sa.ChangePassword.warning.InvalidUsername')
      fb.loginId = 'error'
    } else {
      fb.loginId = ''
    }

    if (!passwordStrengthTest(newPassword)) {
      if (help.length === 0) {
        help = t('setup.sa.ChangePassword.warning.InvalidPassword')
      }
      fb.newPassword = 'error'
    } else {
      fb.newPassword = ''
    }

    if (newPassword !== confirmPassword || !confirmPassword || confirmPassword.length === 0) {
      if (help.length === 0) {
        help = t('setup.sa.ChangePassword.warning.NotMatched')
      }
      fb.confirmPassword = 'error'
    } else {
      fb.confirmPassword = ''
    }

    setFB(fb)
    setHelp(help)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!touched) {
      setTouched(true)
    }

    if (e.target.name === 'loginId') {
      setLoginId(e.target.value)
    } else if (e.target.name === 'newPassword') {
      setNewPassword(e.target.value)
    } else if (e.target.name === 'confirmPassword') {
      setConfirmPassword(e.target.value)
    }
  }

  React.useEffect(() => {
    if (touched) {
      validation()
    }
  }, [loginId, newPassword, confirmPassword])

  const { admin, setAdmin } = React.useContext(AdminContext)
  const { step, setStep } = React.useContext(StepContext)

  const dispatch = useDispatch()

  const applyForm = () => {
    const key = props.type === 'systemadmin' ? 'system' : 'policy'
    setAdmin({
      ...admin,
      [key]: {
        ...admin[key],
        loginId,
        newPassword,
        password: '1111'
      }
    })
    setStep(step + 1)
    const url = props.type === 'systemadmin' ? '/launch/wallet-setting/choose-process' : '/launch/policy-admin/fingerprint-setting'
    dispatch(replace(url))
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      if (touched && !hasError) {
        applyForm()
      }
    }
  }

  // disabled props 로 실행 가능 여부를 미리 확인함
  const onClick = () => {
    applyForm()
  }

  return (
    <Form className="launch-admin-form">
      <Form.Item validateStatus={fb.loginId} hasFeedback={true} className="launch-admin-info-input">
        <Input
          name="loginId"
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0)' }}/>}
          placeholder={t('setup.sa.ChangePassword.placeholder.Username')}
          onChange={onChange}
          onKeyUp={onKeyUp}
          value={loginId}
        />
      </Form.Item>
      <Form.Item validateStatus={fb.newPassword} hasFeedback={true} className="launch-admin-info-input">
        <Input.Password
          name="newPassword"
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0)' }}/>}
          placeholder={t('setup.sa.ChangePassword.placeholder.NewPassword')}
          onChange={onChange}
          onKeyUp={onKeyUp}
          value={newPassword}
        />
      </Form.Item>
      <Form.Item validateStatus={fb.confirmPassword} hasFeedback={true} help={help} className="launch-admin-info-input">
        <Input.Password
          name="confirmPassword"
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0)' }}/>}
          placeholder={t('setup.sa.ChangePassword.placeholder.ConfirmPassword')}
          onChange={onChange}
          onKeyUp={onKeyUp}
          value={confirmPassword}
        />
      </Form.Item>
      <Button type="primary" className="launch-admin-wrapper-submit" disabled={!touched || hasError} onClick={onClick}>
        {t('setup.sa.ChangePassword.Btn.ChangePassword')}
      </Button>
    </Form>
  )
}

export default ChangeAdminInfo
