import React, { useCallback, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import AuthWrapper from './AuthWrapper'
import SideNav from './SideNav'
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

/* 좌측 (사이드) 메뉴를 보여야 할 URL 경로들. 시스템 관리자, 정책 관리자, 재정 관리자 페이지들이다.*/
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
 * exact: 현재 location이 children(서브) 페이지의 주소일 경우는 연결되지 않도록 해주는 속성
 */
const routes = [
  {
    path: '/launch',
    Component: React.lazy(() => import('../pages/LaunchPage')),
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
        Component: React.lazy(() => import('../pages/LaunchPage/LaunchSteps')),
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
    Component: React.lazy(() => import('../404')),
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

/* 좌측 메뉴 펼침 상태(FoldContext.folded)와 각 페이지의 좌측 메뉴 디스플레이 여부(withoutMenu)를 반영하여 현재 메뉴(페이지)의 컴포넌트를 반환하는 함수.*/
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

/* 접근 권한을 체크하기 위해 각각의 라우트 컴포넌트를 AuthWrapper 컴포넌트로 wrapping한 다음 실제로 Route 컴포넌트를 생성하는 함수. */
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
        key={key}   //  a unique key prop added to each route component will cause React to recreate the component instance when the route changes.
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

let lastMovement = Date.now()               // 마우스를 마지막으로 움직인 시간을 저장

const TIMEOUT_THRESHOLD = 1000 * 60 * 60

const GuardRouter: React.FC<ReduxType> = props => {
  const [R, setR] = React.useState<React.ReactNode[]>([])
  const [folded, setFolded] = React.useState(false)
  const [renderSide, setRenderSide] = React.useState(false)

  const [percent, setPercent] = React.useState(0) // 1. HSM체크 

  const [hsmInit, setHSMInit] = React.useState<LOADING_STATE>(LOADING_STATE.LOADING)
  const [serverInit, setServerInit] = React.useState<LOADING_STATE>(LOADING_STATE.WAITING)
  const [contextInit, setContextInit] = React.useState<LOADING_STATE>(LOADING_STATE.WAITING)

  const [showScreen, setShowScreen] = React.useState(false)
  const [info, setInfo] = React.useState('Checking HSM...')

  const dispatch = useDispatch()
  const pathname = useSelector<RootState, string>(state => state.router.location.pathname)

  /* HSM체크가 완료되면 백엔드 서버와의 API 통신 테스트를 수행하고 코인 컨텍스트 정보 수신을 시작한다.*/
  React.useEffect(() => {
    const healthCheck = () => {
      const token = setTimeout(() => {
        Api.common.systemStatus()     // 백엔드 서버와의 API 통신 테스트
        .then(() => {
          clearInterval(token)
          setPercent(80)
          setServerInit(LOADING_STATE.DONE)
          setContextInit(LOADING_STATE.LOADING)
          setTimeout(() => {
            clearInterval(token)
            EventEmitter.dispatch('refresh-coin-context')   // 코인 컨텍스트 정보 수신을 시작
          }, 1000)
        })
        .catch(healthCheck)
      }, 500)
    }
    
    if (hsmInit === LOADING_STATE.DONE) {
      healthCheck()
    }
  }, [hsmInit])
  
  /* 코인 컨텍스트 정보 수신을 완료하고 화면 표시 플래그를 켠다.*/
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
  
  /* HSM 체크를 시작한다.*/
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
      setServerInit(LOADING_STATE.LOADING)        // 백엔드 서버와의 API 통신 테스트 시작
      setInfo('Waiting for server...')
    }
    /* 아래 두 라인의 이벤트 채널이 미묘하게 다르므로 주의하자: 'hsm-checked' vs 'hsm-check' */
    ipcRenderer.on('hsm-checked', hsmCheck) // 이 이벤트 리스너에 대해 main.ts -> hsm.ts 에서 webContent.send('hsm-checked', ...)로 응답을 보낼 것이다. */
    ipcRenderer.send('hsm-check')           // main.ts -> hsm.ts 에서 ipcMain.on('hsm-check', ...)으로 이벤트 리스너를 열어두고 있다.
    return () => ipcRenderer.removeListener('hsm-checked', hsmCheck)
  }, [])

  /// Call once
  React.useEffect(() => {
    const components: React.ReactNode[] = []
    routes.forEach((r, i) => concatRoute(r, '', components, `${i}`))  // 모든 라우트(페이지) 정보를 컴포넌트로 생성하여 React.ReactNode[]에 담는다.
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
    setRenderSide(SIDER.some(v => props.location.pathname.startsWith(v)))   // 현재 요청받은 경로가 좌측 사이드 메뉴가 필요한 경로인지 확인한다.
  }, [props.location])

  /* 아래 코드는 특정 DIV 엘리먼트에 마우스 move 시 호출될 콜백 함수를 등록하기 위한 함수를 정의한다.
     ※  useCallback() 은 React Hook API 함수다. 콜백 함수를 메모리에 상주시킬 수 있는 것으로 보인다. 참조> https://ko.reactjs.org/docs/hooks-reference.html#usecallback
     ※ _.throttle 은 milliseconds 단위로 함수 실행을 지연시킨다. 참조> https://lodash.com/docs/4.17.15#throttle */
  const onMouseMove = useCallback(_.throttle((e: React.MouseEvent<HTMLDivElement>) => {
    lastMovement = Date.now()
    console.log("LastMovement:", lastMovement)
  }, 1000), [])

  /* 마우스를 일정시간동안 움직이지 않으면 자동으로 로그아웃시키는 Side-Effect 함수 */
  useEffect(() => {
    const handler = setInterval(() => {
      if (pathname.startsWith('/login')) {
        return
      }

      if (Date.now() - lastMovement > TIMEOUT_THRESHOLD) {  // 마우스를 1시간 동안 움직이지 않았다면...
        batch(() => {
          notification.error({
            duration: 0,
            message: 'Timeout',
            description: 'No activation after one hour!'
          })
          dispatch(logout())            // 로그아웃하고 다시 로그인 화면으로 이동시킨다.
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
          {renderSide && <SideNav key="__SIDER__"/>}
          <div onMouseMove={onMouseMove} style={{ width: '100%', height: '100%' }}>
            <Switch>{R}</Switch>    {/* <Switch>는 현재 경로에 매칭되는 첫번째 자식 <Route> 혹은 <Redirect> 엘리먼트를 렌더링한다. */}
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

/* HSM, 백엔드 서버, 코인 컨텍스트 체크 상태(준비,진행,완료,실패)를 표시하기 위한 엘리먼트 정의 */
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

const mapStateToProps = (state: RootState): ReduxType => ({   // Store가 가진 state를 props에 엮기 위한 맵핑 함수를 정의.
  loggedIn: state.session.loggedIn,
  session: state.session.session,
  location: state.router.location
})

/* mapStateToProps 함수를 사용하여 Store의 state를 props으로 참조할 수 있다.
   만약 Store의 state를 자동으로(dispatch 호출없이) 수정해야 한다면 dispatch를 props에 연결시키는 mapDispatchToProps 혹은 bindActionCreators 함수가 필요하다.
   connect를 사용하여 위에서 만들어진 mapStateToProps를 GuardRouter 컴포넌트에 연결하고 익스포트한다. */
export default connect(mapStateToProps)(GuardRouter)
