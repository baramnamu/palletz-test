import React, { useCallback, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import AuthWrapper from './AuthWrapper'
// import SideNav from './SideNav'
import { RootState } from '../reducers'
import { batch, connect, useDispatch, useSelector } from 'react-redux'
import { SessionState } from '../reducers/sessionReducer'
import { Location } from 'history'
import Api from '../api'
import axios from 'axios'
import { Icon, notification, Spin } from 'antd'
import { ipcRenderer } from 'electron'
import EventEmitter from '../store/eventEmitter'
import _ from 'lodash'
import { logout } from '../actions/sessionActions'
import { replace } from 'connected-react-router'

const SIDER = [
  '/system-admin',
  '/finance-manager',
  '/policy-manager'
]

/**
 * 각 메뉴별 특성을 감안한 라우트(URL) 정보 객체. 실제 라우트 컴포넌트 생성은 아래 concatRoute 함수에서 수행된다.
 * path: 컨텍스트를 제외한 URL
 * Component: 해당 메뉴(페이지) 컴포넌트
 * withoutMenu: 좌측 메뉴 존재 여부
 * exact: children(서브) 페이지의 주소일 경우는 연결되지 않도록 해주는 속성
 */
const routes = [
  {
    path: '/launch',
    // Component: React.lazy(() => import('../pages/LaunchPage')),
    withoutMenu: true
  },
  {
    path: '/login',
    // Component: React.lazy(() => import('../pages/LoginPage')),
    withoutMenu: true
  },
  {
    path: '/policy-manager',
    children: [
      {
        path: '/global-policy',
        // Component: React.lazy(() => import('../pages/PolicyManager/WhitelistPolicyPage'))
      },
      {
        path: '/create-wallet',
        // Component: React.lazy(() => import('../pages/PolicyManager/WalletCreationPage/index'))
      },
      {
        path: '/wallet-policy',
        // Component: React.lazy(() => import('../pages/PolicyManager/WalletPolicyPage'))
      },
      {
        path: '/log-view',
        // Component: React.lazy(() => import('../pages/PolicyManager/LogViewPage'))
      }
    ]
  },
  {
    path: '/finance-manager',
    // Component: React.lazy(() => import('../pages/FinanceManager/WalletList')),
    exact: true,
    children: [
      {
        path: '/tx',
        children: [
          {
            path: '/history',
            // Component: React.lazy(() => import('../pages/FinanceManager/TxHistoryPage'))
          },
          {
            path: '/responded-transactions',
            // Component: React.lazy(() => import('../pages/FinanceManager/TxRespondedTransaction'))
          },
          {
            path: '/progressing-draft',
            // Component: React.lazy(() => import('../pages/FinanceManager/TxProgressDraft'))
          },
          {
            path: '/approval',
            // Component: React.lazy(() => import('../pages/FinanceManager/TxOnProgressPage/ApprovalPage'))
          }
        ]
      },
      {
        path: '/policy-approval',
        // Component: React.lazy(() => import('../pages/FinanceManager/PolicyApprovalPage'))
      },
      {
        path: '/wallet-list',
        // Component: React.lazy(() => import('../pages/FinanceManager/WalletList'))
      },
      {
        path: '/wallet-export',
        // Component: React.lazy(() => import('../pages/FinanceManager/WalletExport'))
      },
      {
        path: '/log-view',
        // Component: React.lazy(() => import('../pages/FinanceManager/LogViewPage'))
      }
    ]
  },
  {
    path: '/system-admin',
    children: [
      {
        path: '/manage-user',
        // Component: React.lazy(() => import('../pages/SystemAdmin/ManageUserPage'))
      },
      {
        path: '/manage-policy-approver',
        // Component: React.lazy(() => import('../pages/SystemAdmin/ManagePolicyApprover'))
      },
      {
        path: '/log-view',
        // Component: React.lazy(() => import('../pages/SystemAdmin/LogViewPage'))
      },
      {
        path: '/backup',
        // Component: React.lazy(() => import('../pages/SystemAdmin/BackupPage'))
      },
      {
        path: '/reset-process',
        // Component: React.lazy(() => import('../pages/SystemAdmin/ResetProcessPage')),
        withoutMenu: true
      }
    ]
  },
  {
    path: '/test',
    children: [
      {
        path: '/step',
        // Component: React.lazy(() => import('../pages/LaunchPage/LaunchSteps')),
        withoutMenu: true
      },
      {
        path: '/hsm',
        // Component: React.lazy(() => import('../components/HSMTest'))
      }
    ]
  },
  {
    path: '/404',
    // Component: React.lazy(() => import('../404')),
    withoutMenu: true
  }
]

/* 좌측 메뉴 폴드(열기/닫기) 타입 */
export type Switcher = {
  folded: boolean,
  setFolded: (f: boolean) => void
}

/* 좌측 메뉴 폴드 컨텍스트 */
export const FoldContext = React.createContext<Switcher>({
  folded: false,
  setFolded: () => {
  }
})

/* 좌측 메뉴 상태(FoldContext.folded)와 루트 객체의 각 루트의 메뉴 디스플레이 여부(withoutMenu)를 감안하여 현재 메뉴(페이지)의 컴포넌트를 반환한다.*/
const withNav = (withoutMenu: boolean, Component: () => JSX.Element) => {
  return (
    <>
      {withoutMenu ?
        <Component/> :
        (<>
          <FoldContext.Consumer>
            {({ folded }) => {
              const foldedSize = folded ? '80' : '320'
              const contentStyle: React.CSSProperties = ({
                position: 'absolute',
                width: `calc(100% - ${foldedSize}px)`,
                left: `${foldedSize}px`,
                top: 0,
                height: '100%',
                transition: 'all 0.2s'
              })

              return (
                <div style={contentStyle}>
                  <Component/>
                </div>
              )
            }}
          </FoldContext.Consumer>
        </>)
      }
    </>
  )
}

/** 실제 라우트 컴포넌트 생성을 수행하는 함수. */
function concatRoute(self: any, context: string, bucket: React.ReactNode[], key: string) {
  if (self.Component) {
    bucket.push(
      <Route
        path={context + self.path}
        // @ts-ignore
        render={() => (<AuthWrapper withoutMenu={self.withoutMenu}>
            {withNav(self.withoutMenu, self.Component)}
          </AuthWrapper>
        )}
        key={key}
        exact={!!self.exact}
      />
    )
  }
  if (self.children) {
    const nextContext = context + self.path
    self.children.map((c: any, i: number) => concatRoute(c, nextContext, bucket, `${nextContext}${i}`))
  }
}

const updateAxiosInterceptor = () => {
// TODO 403 error 시 logout && login 화면 redirection
  axios.interceptors.response.use(r => r, (e: any) => {
    if (e.response === undefined || e.response.data === undefined) {
      notification['error']({ message: 'PalletZ Error', description: 'Server is down' })
      return Promise.reject({
        response: {
          status: -1
        }
      })
    }

    const { response: { data: { message } } } = e
    notification['error']({ message: 'PalletZ Error', description: message || `${e}` })
    return Promise.reject(e)
  })
}

enum LOADING_STATE {
  WAITING,
  LOADING,
  DONE,
  FAIL
}

let lastMovement = Date.now()

const TIMEOUT_THRESHOLD = 1000 * 60 * 60

const GuardRouter: React.FC<ReduxType> = props => {
  const [R, setR] = React.useState<React.ReactNode[]>([])
  const [folded, setFolded] = React.useState(false)
  const [renderSide, setRenderSide] = React.useState(false)

  const [percent, setPercent] = React.useState(0)

  const [hsmInit, setHSMInit] = React.useState<LOADING_STATE>(LOADING_STATE.LOADING)
  const [serverInit, setServerInit] = React.useState<LOADING_STATE>(LOADING_STATE.WAITING)
  const [contextInit, setContextInit] = React.useState<LOADING_STATE>(LOADING_STATE.WAITING)

  const [showScreen, setShowScreen] = React.useState(false)
  const [info, setInfo] = React.useState('Checking HSM...')

  const dispatch = useDispatch()
  const pathname = useSelector<RootState, string>(state => state.router.location.pathname)

  React.useEffect(() => {
    const healthCheck = () => {
      const token = setTimeout(() => {
        Api.common.systemStatus()
          .then(() => {
            clearInterval(token)
            setPercent(80)
            setServerInit(LOADING_STATE.DONE)
            setContextInit(LOADING_STATE.LOADING)
            setTimeout(() => {
              clearInterval(token)
              EventEmitter.dispatch('refresh-coin-context')
            }, 1000)
          })
          .catch(healthCheck)
      }, 500)
    }

    if (hsmInit === LOADING_STATE.DONE) {
      healthCheck()
    }
  }, [hsmInit])

  React.useEffect(() => {
    const watcher = EventEmitter.subscribe('refresh-coin-context-done', () => {
      if (contextInit !== LOADING_STATE.DONE) {
        setPercent(100)
        updateAxiosInterceptor()
        setContextInit(LOADING_STATE.DONE)
        setTimeout(() => {
          setShowScreen(true)
        }, 1000)
      }
    })
    return () => watcher()
  }, [])

  // @ts-ignore
  React.useEffect(() => {
    const hsmCheck = (_: any, e?: Error) => {
      if (e) {
        setHSMInit(LOADING_STATE.FAIL)
        setInfo('HSM has problem! Cannot continue process')
        return
      }

      setPercent(50)
      setHSMInit(LOADING_STATE.DONE)
      setServerInit(LOADING_STATE.LOADING)
      setInfo('Waiting for server...')
    }
    ipcRenderer.on('hsm-checked', hsmCheck)
    ipcRenderer.send('hsm-check')
    return () => ipcRenderer.removeListener('hsm-checked', hsmCheck)
  }, [])

  /// Call once
  React.useEffect(() => {
    const components: React.ReactNode[] = []
    routes.forEach((r, i) => concatRoute(r, '', components, `${i}`))
    components.push(
      <Route
        key={components.length + 1}
        render={() => <Redirect to={'/404'}/>}
      />
    )
    setR(components)
  }, [props.session])

  const foldValue = {
    folded,
    setFolded: (f: boolean) => {
      setFolded(f)
    }
  }

  React.useEffect(() => {
    setRenderSide(SIDER.some(v => props.location.pathname.startsWith(v)))
  }, [props.location])

  const onMouseMove = useCallback(_.throttle((e: React.MouseEvent<HTMLDivElement>) => {
    lastMovement = Date.now()
    console.log("LastMovement:", lastMovement)
  }, 1000), [])

  useEffect(() => {
    const handler = setInterval(() => {
      if (pathname.startsWith('/login')) {
        return
      }

      if (Date.now() - lastMovement > TIMEOUT_THRESHOLD) {
        batch(() => {
          notification.error({
            duration: 0,
            message: 'Timeout',
            description: 'No activation after one hour!'
          })
          dispatch(logout())
          dispatch(replace('/login'))
        })
      }
    }, 5000)

    return () => clearInterval(handler)
  }, [pathname])

  return (
    <>
      {showScreen ? (
        <FoldContext.Provider value={foldValue}>
          {/* {renderSide && <SideNav key="__SIDER__"/>} */}
          <div onMouseMove={onMouseMove} style={{ width: '100%', height: '100%' }}>
            <Switch>{R}</Switch>
          </div>
        </FoldContext.Provider>
      ) : (
        <div className="loading-screen" key="__LOADING__">
          <div className="loading-info">
            <Indicator type={'HSM'} ready={hsmInit}/>
            <Indicator type={'Service'} ready={serverInit}/>
            <Indicator type={'Coin Context'} ready={contextInit}/>
          </div>
          <div className="loading-loading" style={{ width: `${percent}%` }}/>
        </div>
      )}
    </>
  )
}

type IndicatorProps = {
  type: string
  ready: LOADING_STATE
}

const Indicator: React.FC<IndicatorProps> = (props) => {
  let indicator

  switch (props.ready) {
    case LOADING_STATE.WAITING:
      indicator = <Icon type="ellipsis"/>
      break
    case LOADING_STATE.LOADING:
      indicator = <Spin indicator={<Icon type="loading"/>}/>
      break
    case LOADING_STATE.DONE:
      indicator = <Icon type="check"/>
      break
    case LOADING_STATE.FAIL:
      indicator = <Icon type="close" theme="twoTone" twoToneColor="#A82A2A"/>
      break
  }

  return (
    <div className="loading-indicator">
      {indicator}
      <span className="ml-1">
        {props.type}
      </span>
    </div>
  )
}

type ReduxType = {
  location: Location
} & SessionState

const mapStateToProps = (state: RootState): ReduxType => ({
  loggedIn: state.session.loggedIn,
  session: state.session.session,
  location: state.router.location
})

export default connect(mapStateToProps)(GuardRouter)
