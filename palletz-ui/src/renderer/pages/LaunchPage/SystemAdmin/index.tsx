import LoginPage from './LoginPage'
import ChangePassword from './ChangePassword'
import * as React from 'react'
import { Route } from 'react-router'

const routes = [
  { path: 'log-in', component: () => (<LoginPage/>)},
  { path: 'change-password', component: () => (<ChangePassword/>)}
]

const SystemAdmin: React.FC = () => {
  return (
    <>
      {routes.map((route, i) => (
        <Route
          key={`SystemAdminRoute${i}`}
          path={`/launch/system-admin/${route.path}`}
          render={route.component}
        />
      ))}
    </>
  )
}

export default SystemAdmin
