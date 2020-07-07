import * as React from 'react'
import LaunchTitle from '../LaunchTitle'
import ChangeAdminInfo from '../ChangeAdminInfo'

const ChangePassword: React.FC = () => {

  return (
    <>
      <LaunchTitle main={"setup.sa.ChangePassword.Title"} sub={"setup.sa.ChangePassword.Subtitle"}/>
      <ChangeAdminInfo type="systemadmin" />
    </>
  )
}

export default ChangePassword
