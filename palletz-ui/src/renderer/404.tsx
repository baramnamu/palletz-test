import * as React from 'react'
import { Button, Result } from 'antd'
import { GotoDefaultPage } from './constants'
import { useDispatch } from 'react-redux'

const NotFoundPage: React.FC = () => {
  const dispatch = useDispatch()

  // TODO URL Logging?

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex'
      }}
    >
      <Result
        status={'info'}
        style={{
          margin: 'auto'
        }}
        title={"Page not found"}
        extra={
          <Button type="primary" key="404" onClick={GotoDefaultPage(dispatch)}>
            Back to default Page
          </Button>
        }
      />
    </div>
  )
}

export default NotFoundPage
