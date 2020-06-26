import * as React from 'react'
import { useDispatch } from 'react-redux'
import api from '../api'
import session from '../session'
import { login } from '../actions/sessionActions'
import { replace } from 'connected-react-router'
import { Button, Icon, Result, Spin } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router'
import { InitLaunchURL, roleUrlMap } from '../constants'
import { FoldContext } from './GuardRouter'
import { StepContext } from '../pages/LaunchPageContext'

/* Spin 컴포넌트 표시 */
const Fallback: React.FC<{ icon: string, withoutMenu: boolean }> = (props) => {

  const { folded } = React.useContext(FoldContext)

  const width = props.withoutMenu ? '100%' : `calc(100% - ${folded ? '80px' : '320px'})`
  const left = props.withoutMenu ? 0 : folded ? '80px' : '320px'

  return (
    <div
      style={{
        width,
        left,
        height: '100vh',
        position: 'absolute',
        top: 0
      }}
    >
      <Spin
        indicator={<Icon type={props.icon} style={{ fontSize: '5rem' }} spin={true}/>}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  )
}

/* Result 컴포넌트 표시 */
const NotAuthorized: React.FC<{ title: string, subTitle: string, isReplace: boolean }> = (props) => {

  const dispatch = useDispatch()

  const onClick = () => {
    if (props.isReplace) {
      dispatch(replace('/login'))
    }

    window.location.reload()
  }

  return (
    <Result
      status="error"
      title={props.title}
      subTitle={props.subTitle}
      extra={[
        <Button type="primary" key="console" onClick={onClick}>
          {props.isReplace ? 'Login' : 'Reload'}
        </Button>
      ]}
    />
  )
}

/**
 * 백엔드 서버와의 통신 체크를 수행하고 시스템 정보(마스터키 정보?), 세션 정보나 사용자 정보를 얻고 단계별로 필요한 조치를 수행한다.
 * @param props 
 */
const AuthWrapper: React.FC<RouteComponentProps & { withoutMenu: boolean }> = props => {
  const [isInit, setInit] = React.useState(false)           // 시스템 초기화 단계.
  const [isAuth, setAuth] = React.useState(false)           // 시스템 정보(마스터키 정보?)가 존재하는 단계. 세션이 없으면 로그인 페이지로 이동한다.
  const [isChecked, setChecked] = React.useState(false)     // 시스템 정보(마스터키 정보?) 없이 특정 페이지(시스템 초기화 단계 제외)에 접근한 단계.
  const [isError, setError] = React.useState(false)         // 에러 발생 단계

  const { step, started } = React.useContext(StepContext)

  const dispatch = useDispatch()
  // @ts-ignore
  React.useEffect(() => {
    setAuth(false)
    setChecked(false)
    let isDone = true
    checkAuth().then(() => {
      if (isDone) {
        setChecked(true)
      }
    }).catch(() => {
      if (isDone) {
        setError(true)
      }
    })

    /* 실제로 단계별 정보(시스템 정보(마스터키 정보?), 세션 정보나 사용자 정보)를 얻고 해당 단계별로 route를 변경하거나 action을 dispatch한다. */
    async function checkAuth() {
      if (isDone) {
        try {
          const { data: { init } } = await api.common.systemStatus()
          // init와 관계없이 일단 서버와의 API 통신 성공
          if (init) {
            const sessionKey = session.getSessionKey()
            if (props.location.pathname === '/login') {
              setAuth(true)
              return
            }
            if (sessionKey == null) {
              dispatch(replace('/login'))
              return
            }
            /* sessionKey가 존재하면 백엔드 서버와 통신하여 사용자 정보를 얻은 다음, action으로 만들어 dispatch한다.*/
            const { data } = await api.session.get()
            dispatch(login(data))
            if (props.location.pathname === '/login' || props.location.pathname.startsWith('/launch')) {
              const url = roleUrlMap[data.userRole]   // 현재 사용자의 대문 페이지로 이동
              dispatch(replace(url))
              return
            }
            setAuth(true)
            return
          }
          setInit(true) // 마스터키 정보는 없지만 시스템 초기화 단계임을 표시
          if (!started && step === 0 && props.location.pathname !== InitLaunchURL) {
            dispatch(replace(InitLaunchURL))    // 시스템 관리자의 패스워드 변경 페이지(시스템 초기화 단계의 첫 페이지)로 이동
          }
        // 서버와의 API 통신 실패  
        } catch (e) {
          const { response } = e
          if (response.status === 401 || response.status === 403 || response.status === -1) {
            if (props.location.pathname !== '/login') {
              dispatch(replace('/login'))
            }
          }
        }
      }
    }

    return () => isDone = false
  }, [props.location.pathname])

  const renderAuth = () => {
    if (isInit) {
      return props.children
    }

    if (isAuth) {
      return props.children
    }

    if (isChecked) {
      return <NotAuthorized title="Not authorized access" subTitle="Unable to execute action" isReplace={true}/>
    }

    if (isError) {
      return <NotAuthorized title="Connection error" subTitle="Failed to connect server" isReplace={false}/>
    }

    return <Fallback key={'fallback'} icon="loading-3-quarters" withoutMenu={props.withoutMenu}/>
  }

  return (
    <React.Suspense fallback={<Fallback key={'fallback'} icon="loading" withoutMenu={props.withoutMenu}/>}>
      {renderAuth()}
    </React.Suspense>
  )
}

export default withRouter(AuthWrapper)
