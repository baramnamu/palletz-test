import { Icon, Input } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import Api from '../../../api'
import * as React from 'react'
import FormWrapper from '../FormWrapper'
import { useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import LaunchTitle from '../LaunchTitle'
import { t } from '../../../i18n'
import { AdminContext, StepContext } from '../../LaunchPageContext'

const LoginPage: React.FC = () => {

  const fields = [
    {
      id: 'loginId',
      options: { rules: [{ required: true, message: 'Login Id is required' }] },
      label: 'Id',
      component: (
        <Input
          autoFocus={true}
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0)' }} />}
          placeholder={t('setup.sa.SignIn.placeholder.Username')}
        />
      )
    },
    {
      id: 'password',
      options: { rules: [{ required: true, message: 'Password is required' }] },
      label: 'Password',
      component: (
        <Input
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0)' }} />}
          type="password"
          placeholder={t('setup.sa.SignIn.placeholder.Password')}
        />
      )
    }
  ]

  const dispatch = useDispatch()

  const { step, setStep, setStarted } = React.useContext(StepContext)
  const { admin, setAdmin } = React.useContext(AdminContext)

  const onSubmit = async ({form}: FormComponentProps) => {
    const { validateFields } = form
    if (validateFields) {
      validateFields((err, dto) => {
        if (err) return
        Api.adminSetup
          .checkAdminAccount(Object.assign({ role: 'SYSTEM_MANAGER' }, dto))
          .then(() => {
            setStarted(true)
            setStep(step + 1)
            setAdmin({
              ...admin,
              system: {
                ...admin.system,
                ...dto
              }
            })
            dispatch(replace('/launch/system-admin/password-setting'))
          })
      })
    }
  }

  return (
    <>
      <LaunchTitle main={'setup.sa.SignIn.Title'} sub={'setup.sa.SignIn.Subtitle'}/>
      <FormWrapper
        formProps={{
          layout: "vertical"
        }}
        onSubmit={onSubmit}
        fields={fields}
        buttonLabel={'setup.sa.SignIn.Btn.SignIn'}
      />
    </>
  )
}

export default LoginPage
