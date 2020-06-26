import * as React from 'react'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { Badge, Button, Col, Icon, Layout, Menu, Row } from 'antd'
import api, { default as Api } from '../api'
import session from '../session'
import { logout } from '../actions/sessionActions'
import { replace } from 'connected-react-router'
import { batch, connect, useDispatch } from 'react-redux'
import { RootState } from '../reducers'
import { FoldContext } from './GuardRouter'
import PzIcon from '../images/icons/PzIcon'
import { t } from '../i18n'
import NotificationModal from './NotificationModal'

const { Header, Content, Sider } = Layout   // 전체 페이지 레이아웃이 아니라 좌측 메뉴만의 레이아웃임.

const { ItemGroup } = Menu

interface Props {

}

/* menuList에 추가할 메뉴 정보(title, icon, link)를 등록하면 아래 React 함수(const SideNav = (props) => {...} )에서 동적으로 처리된다. */
const menuList: {
  [key: string]: {
    title: string
    subMenu: {
      icon: string
      link: string
      title: string,
      auth?: boolean
    }[]
  }[]
} = {
  INVALID: [
    {
      title: 'INVALID',
      subMenu: [
        { icon: 'Info', link: '/', title: '?' }
      ]
    }
  ],
  SYSTEM_MANAGER: [
    {
      title: 'ADMINISTRATION',
      subMenu: [
        { icon: 'Admin', link: '/system-admin/manage-user', title: t('menu.sm.administration.AdminList') },
        {
          icon: 'Approver',
          link: '/system-admin/manage-policy-approver',
          title: t('menu.sm.administration.PolicyApprover')
        }
      ]
    },
    {
      title: 'SYSTEM SETTINGS',
      subMenu: [
        { icon: 'Backup', link: '/system-admin/backup', title: t('menu.sm.system.Backup') },
      ]
    },
    {
      title: 'MANAGEMENT',
      subMenu: [
        { icon: 'Log', link: '/system-admin/log-view', title: t('menu.sm.management.LogView') }
        // { icon: 'Setting', link: '/system-manager/setting', title: 'Settings' }
      ]
    }
  ],
  POLICY_MANAGER: [
    {
      title: 'POLICY',
      subMenu: [
        // { icon: 'GlobalPolicy', link: '/policy-manager/global-policy', title: t('menu.pm.policy.GlobalPolicy') },
        { icon: 'Wallet', link: '/policy-manager/wallet-policy', title: t('menu.pm.policy.WalletPolicy') }
      ]
    },
    {
      title: 'WALLET',
      subMenu: [
        { icon: 'WalletAdd', link: '/policy-manager/create-wallet', title: t('menu.pm.wallet.WalletCreation') }
      ]
    },
    {
      title: 'MANAGEMENT',
      subMenu: [
        { icon: 'Log', link: '/policy-manager/log-view', title: t('menu.pm.management.LogView') }
        // { icon: 'Setting', link: '/policy-manager/setting', title: 'Settings' }
      ]
    }
  ],
  FINANCE_MANAGER: [
    {
      title: 'WALLET',
      subMenu: [
        { icon: 'WalletList', link: '/finance-manager/wallet-list', title: t('menu.fm.wallet.WalletList') },
        { icon: 'WalletExport', link: '/finance-manager/wallet-export', title: t('menu.fm.wallet.WalletExport') }
      ]
    },
    {
      title: 'LIST',
      subMenu: [
        {
          icon: 'Draft',
          link: '/finance-manager/tx/progressing-draft', title: t('menu.fm.list.ProgressingDraft')
        },
        {
          icon: 'DraftApproved',
          link: '/finance-manager/tx/responded-transactions', title: t('menu.fm.list.RespondedTransactions')
        },
        {
          icon: 'History',
          link: '/finance-manager/tx/history', title: t('menu.fm.list.History')
        }
      ]
    },
    {
      title: 'MANAGEMENT',
      subMenu: [
        { icon: 'PolicyApproval', link: '/finance-manager/policy-approval', title: 'Policy Approval', auth: true },
        { icon: 'Log', link: '/finance-manager/log-view', title: t('menu.fm.management.LogView') }
      ]
    }
  ]
}

const softRole: KvMap<string> = {
  'FINANCE_MANAGER': t('menu.profile.FinanceManager'),
  'POLICY_MANAGER': t('menu.profile.PolicyManager'),
  'SYSTEM_MANAGER': t('menu.profile.SystemManager'),
  'INVALID': '?'
}

const whiteStyle = { color: '#fff', fontSize: 16, fontWeight: 700 }

const mapStateToProps = ({ session }: RootState) => ({
  role: session.session ? session.session.userRole : 'INVALID',
  policyApprover: session.session ? session.session.policyApprover : false,
  name: session.session ? session.session.name : '?'
})

const SideNav = (props: RouteComponentProps & Props & ReturnType<typeof mapStateToProps>) => {
  const dispatch = useDispatch()
  const { location, role } = props

  const logoutProcess = () => {
    session.clearSession()
    batch(() => {
      dispatch(logout())
      dispatch(replace('/login'))
    })
  }

  const logoutPage = () => {
    api.session.logout()
      .then(logoutProcess)
      .catch(logoutProcess)
  }
  const [visibleNotification, setVisibleNotification] = React.useState(false)
  const [hasNewNotification, setHasNewNotification] = React.useState(false)

  const onCollapse = (f: boolean, sF: (f: boolean) => void) => {
    return () => {
      sF(!f)
    }
  }
  const myNotifications = () => {
    setVisibleNotification(true)
  }
  React.useEffect(() => {
    hasNewNotifications()
  }, [visibleNotification])

  const hasNewNotifications = () => {
    Api.notification.hasNewNotifications().then(({ data: { hasNewNotifications } }) => {
      setHasNewNotification(hasNewNotifications)
    })
  }

  return (
    <FoldContext.Consumer>
      {({ folded, setFolded }) => (
        <Sider collapsed={folded} style={{ height: '100vh', backgroundColor: 'black', position: 'fixed' }} width={320}>
          <Header
            style={{
              backgroundColor: 'black',
              color: 'white',
              fontSize: 26,
              padding: folded ? '0' : '32px 32px',
              textAlign: 'left',
              lineHeight: '32px',
              minHeight: 96
            }}
          >
            {folded ? (
              <div className="sider-profile" style={{ backgroundColor: 'black' }}>
                <Icon type="sketch"/>
              </div>
            ) : (
              // PALLLET Z 타이틀 배너와 알림 배지 라인
              <Row style={{ width: '100%' }}>
                <Col span={20}>
                  <span style={{ fontWeight: 'normal' }}>PALLET</span>
                  <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>Z</span>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Badge
                    count={hasNewNotification ? 'N' : 0}
                    style={{
                      padding: '0 3px',
                      minWidth: '15px',
                      height: '15px',
                      lineHeight: '14px',
                      fontSize: '10px'
                    }}
                  >
                    <Icon type="bell" style={{ fontSize: 26 }} onClick={myNotifications}/>
                    <NotificationModal
                      visible={visibleNotification}
                      visibleHandler={setVisibleNotification}
                      userRole={role}
                    />
                  </Badge>
                </Col>
              </Row>
            )}
          </Header>
          <Content>
            <div
              style={{
                textAlign: 'center'
              }}
              className="sider-profile"
            >
              {folded ? (
                <Icon type="user"/>
              ) : (
                <div
                  style={{
                    textAlign: 'left',
                    lineHeight: '1rem',
                    fontSize: '1rem',
                    color: 'white'
                  }}
                >
                  <Row gutter={4}>
                    <Col span={16}>
                      <Row>
                    <span
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}
                    >
                      {props.name}
                    </span>
                      </Row>
                      <Row>
                    <span
                      style={{
                        fontSize: '12px'
                      }}
                    >
                      {softRole[props.role]}
                    </span>
                      </Row>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Button ghost={true} onClick={logoutPage}>
                        Logout
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
            <Menu
              mode="inline"
              theme={'dark'}
              selectable={false}
            >
              {menuList[props.role].map((menu, i) => (  // props.role = [ SYSTEM_MANAGER | POLICY_MANAGER | FINANCE_MANAGER ]
                <ItemGroup title={folded ? menu.title[0] : menu.title} key={i}>
                  {menu.subMenu
                    .filter(v => {
                      if (v.auth === undefined) return true     // auth 속성이 없는 서브메뉴는 모두 표시한다.
                      if (props.policyApprover) return v.auth   // auth 속성이 있고 현재 사용자가 정책승인자(policyApprover)일 경우 auth 속성이 true일 경우만 서브메뉴를 표시한다.
                      return false
                    })
                    .map((sub, j) => (
                      <Menu.Item
                        key={`${i}-${j}`}
                        className={sub.link === location.pathname ? 'ant-menu-item-selected' : ''}
                      >
                        {sub.link ? (                                   // <NavLink>는 현재 URL이 to 속성의 링크값과 일치할 경우 스타일 속성이 추가해준다.
                          <NavLink to={sub.link}>
                            <PzIcon type={sub.icon} width={36} height={48} viewBox={'-8 -8 36 36'}/>
                            <span>{sub.title}</span>
                          </NavLink>) : (
                          <span>
                            <Icon type={sub.icon}/>
                            <span>{sub.title}</span>
                          </span>
                        )}
                      </Menu.Item>
                    ))}
                </ItemGroup>
              ))}
            </Menu>
          </Content>
        </Sider>
      )}
    </FoldContext.Consumer>
  )
}

/* withRouter는 history 객체와 가장 가까운 상위 <Route>의 match에 접근할 수 있도록 해준다.
   또한 wrapped component가 렌더링될 때 마다 업데이트된 match, location, 그리고 history props 을 전달한다. */
export default withRouter(connect(mapStateToProps)(SideNav))
