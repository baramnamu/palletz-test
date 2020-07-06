import React from "react"
import { Button, Descriptions, Icon, Modal, Table } from 'antd'
import Api from "../api"
import {ExpandIconProps} from "antd/lib/table/interface"
import Currency from './Currency'
import moment from "moment"
import { ResourceKey, t } from '../i18n'

interface ModalProps {
  visible: boolean,
  visibleHandler: Function,
  userRole: string
}

interface LogRow {
  key: string,
  isNew?: React.ReactNode,
  type: string,
  detail?: any,
  status: string,
  date: string
}

interface LogData {
  id: string,
  pageType: string,
  log: any,
  createdAt: Date
}
const NotificationModal: React.FC<ModalProps> = (props) => {
  const [visible, setVisible] = React.useState(props.visible)
  const [data, setData]: any = React.useState()

  const [page, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)


  React.useEffect(() => {
    console.log('props', props)
    setVisible(props.visible)

    if( props.visible ) {
      getMyNotifications()
    }
  }, [props.visible])

  const handleOk = () => {      // 모달창 닫기 함수
    setVisible(false)
    props.visibleHandler(false)
  }

  /* 새로운 알림(Notification) 옆에 "N"자 표시를 하기 위한 노드(엘리먼트) 정의 */
  const isNew = (v?: boolean): React.ReactNode => {
    if( v ) return <div style={{backgroundColor:'#E03131', borderRadius:'50%', textAlign:'center', color:'#ffffff', width:'24px', height:'24px', lineHeight:'24px'}}>N</div>
    else return <></>
  }

  /* API 서버를 통해 알림(Notification) 정보를 페이지 단위로 수신하여 data와 total 변수에 저장한다.*/
  const getMyNotifications = (page: number = 1) => {
    Api.notification.myNotifications(page - 1).then(({data: {content, totalElements}}) => {
      const data: any[] = content
      const _logData: LogRow[] = []
      data.forEach(d => {
        console.log('notification data', d)

        d.log = d.log ? JSON.parse(d.log) : {}
        d.log.id = d.id
        d.log.pageType = d.pageType
        d.log.actionType = d.actionType

        const logRow: LogRow = {
          key: d.id,
          isNew: isNew(d.isNewNotification),
          type: getPageTypeText(d.pageType),
          status: getStatus(d),
          detail: d.log,
          date: moment(d.createdAt).format('YYYY-MM-DD hh:mm:ss')
        }
        _logData.push(logRow)
      })

      setData(_logData)
      setTotal(totalElements)
    })
  }

  /* 알림(Notification) 정보의 타입 이름표를 만든다.*/
  const getPageTypeText = (k: string): string => {
    const pageTypeMap = new Map()
    pageTypeMap.set('DRAFT', t('common.notification.pageType.draft'))
    pageTypeMap.set('WALLET', t('common.notification.pageType.wallet'))
    pageTypeMap.set('GLOBAL_POLICY' , t('common.notification.pageType.globalPolicy'))
    pageTypeMap.set('FINANCIAL_ADMIN' , t('common.notification.pageType.finacialAdmin'))
    pageTypeMap.set('BACKUP' , t('common.notification.pageType.backup'))
    pageTypeMap.set('POLICY_APPROVER', t('common.notification.pageType.policyApprover'))
    pageTypeMap.set('WALLET_POLICY', t('common.notification.pageType.policy'))

    return pageTypeMap.get(k)
  }

  /* 시스템관리자 관련 알림 모음 중에서 해당되는 알림의 노드를 생성하여 반환한다. */
  const getSystemManagerStatus = (d: any): React.ReactNode => {
    if( d.pageType === 'WALLET') {
      if( d.actionType === 'CHANGED_FINANCIAL_ADMIN' ) return <><span>{t('common.notification.status.changedFinancialAdmin')}</span> {d.isBackupRequire && <span> -> {t('common.notification.status.backupRequired')}</span>}</>
      if( d.actionType === 'CREATED_WALLET' ) return <><span>{t('common.notification.status.created')}</span> {d.isBackupRequire && <span> -> {t('common.notification.status.backupRequired')}</span>}</>
      if( d.actionType === 'CHANGED_WALLET_NAME' ) return <><span>{t('common.notification.status.nameChanged')}</span> {d.isBackupRequire && <span> -> {t('common.notification.status.backupRequired')}</span>}</>
    }
    else if( d.pageType === 'FINANCIAL_ADMIN') {
      if( d.actionType === 'ADDED' ) return <span><span style={{color:'#0CAD5D', marginRight:'15px'}}>{t('common.notification.status.added')}</span><span>(ID : {d.log.loginId})</span>{d.isBackupRequire && <span> -> {t('common.notification.status.backupRequired')}</span>}</span>
      if( d.actionType === 'DELETED' ) return <span><span style={{color:'#E03131', marginRight:'15px'}}>{t('common.notification.status.deleted')}</span><span>(ID : {d.log.loginId})</span>{d.isBackupRequire && <span> -> {t('common.notification.status.backupRequired')}</span>}</span>
      if( d.actionType === 'REPLACED_CARD' ) return <span><span style={{marginRight:'15px'}}>{t('common.notification.status.cardReplace')}</span><span>(ID : {d.log.loginId})</span>{d.isBackupRequire && <span> -> {t('common.notification.status.backupRequired')}</span>}</span>
    }
    else if( d.pageType === 'BACKUP') {
      return <span>Successfully Completed</span>
    }
    else if( d.pageType === 'WALLET_POLICY' ) {
      if( d.actionType === 'CHANGED_VELOCITY_LIMIT') {
        return (
          <span>
            {d.log.velocityLimitType === 'ONETIME' && <><span>{t('common.notification.status.onetime')}</span>{d.isBackupRequire && <span> -> {t('common.notification.status.backupRequired')}</span>}</>}
            {d.log.velocityLimitType === 'TIMEWINDOW_DAY' && <><span>{t('common.notification.status.timewindowDay')}</span>{d.isBackupRequire && <span> -> {t('common.notification.status.backupRequired')}</span>}</>}
            {d.log.velocityLimitType === 'TIMEWINDOW_WEEK' && <><span>{t('common.notification.status.timewindowWeek')}</span>{d.isBackupRequire && <span> -> {t('common.notification.status.backupRequired')}</span>}</>}
            {d.log.velocityLimitType === 'TIMEWINDOW_MONTH' && <><span>{t('common.notification.status.timewindowMonth')}</span>{d.isBackupRequire && <span> -> {t('common.notification.status.backupRequired')}</span>}</>}
          </span>
        )
      }
      if( d.actionType === 'CHANGED_APPROVAL_POLICY') {
        return (
          <span>
            { d.actionType === 'CHANGED_APPROVAL_POLICY' && <><span style={{color:'#0CAD5D', marginRight:'15px'}}>{t('common.notification.status.changedApprovalPolicy')}d</span>{d.isBackupRequire && <span> -> {t('common.notification.status.backupRequired')}</span>}</>}
            <span> ({t('common.notification.status.changedApprovalPolicy')})</span>
          </span>
        )
      }
    }

    return 'Unknown'
  }

  /* 정책관리자 관련 알림 모음 중에서 해당되는 알림의 노드를 생성하여 반환한다. */
  const getPolicyManagerStatus = (d: any): React.ReactNode => {
    if( d.pageType === 'FINANCIAL_ADMIN') {         // 재정관리자 추가/삭제/카드교체 알림
      if( d.actionType === 'ADDED' ) return <span><span style={{color:'#0CAD5D', marginRight:'15px'}}>{t('common.notification.status.added')}</span><span> {d.log.loginId}</span></span>
      if( d.actionType === 'DELETED' ) return <span><span style={{color:'#E03131', marginRight:'15px'}}>{t('common.notification.status.deleted')}</span><span> {d.log.loginId}</span></span>
      if( d.actionType === 'REPLACED_CARD' ) return <span><span style={{marginRight:'15px'}}>{t('common.notification.status.cardReplace')}</span><span> {d.log.loginId}</span></span>
    }
    else if( d.pageType === 'GLOBAL_POLICY' ) {     // Global 정책 변경 알림
      if( d.actionType === 'ADDED_WHITELIST' || d.actionType === 'DELETED_WHITELIST'
        || d.actionType === 'CHANGED_WHITELIST_NAME' || d.actionType === 'CHANGED_GROUP' || d.actionType === 'CHANGED_GROUP_NAME') {
        return (<><span style={{color: '#0CAD5D', marginRight: '15px'}}>{t('common.notification.status.approved')}</span><span>({t('common.notification.status.whitelistUpdated')})</span></>)
      }
      if( d.actionType === 'REJECTED_WHITELIST' ) {       // 화이트리스트 변경 기각 알림
        return (<><span style={{color:'#E03131', marginRight:'15px'}}>{t('common.notification.status.rejected')}</span><span>({t('common.notification.status.whitelistUpdated')})</span></>)
      }
    }
    else if( d.pageType === 'WALLET_POLICY' ) {       // 지갑 송금 정책 변경 알림
      if( d.actionType === 'CHANGED_VELOCITY_LIMIT' || d.actionType === 'REJECTED_VELOCITY_LIMIT' ) {
        return (
          <span>
            { d.actionType === 'CHANGED_VELOCITY_LIMIT' && <span style={{color:'#0CAD5D', marginRight:'15px'}}>{t('common.notification.status.approved')}</span>}
            { d.actionType === 'REJECTED_VELOCITY_LIMIT' && <span style={{color:'#E03131', marginRight:'15px'}}>{t('common.notification.status.rejected')}</span>}
            <span>
              {d.log.velocityLimitType === 'ONETIME' && <span> ({t('common.notification.status.onetime')})</span>}
              {d.log.velocityLimitType === 'TIMEWINDOW_DAY' && <span> ({t('common.notification.status.timewindowDay')})</span>}
              {d.log.velocityLimitType === 'TIMEWINDOW_WEEK' && <span> ({t('common.notification.status.timewindowWeek')})</span>}
              {d.log.velocityLimitType === 'TIMEWINDOW_MONTH' && <span> ({t('common.notification.status.timewindowMonth')})</span>}
            </span>
          </span>
        )
      }
      if( d.actionType === 'CHANGED_APPROVAL_POLICY' || d.actionType === 'REJECTED_APPROVAL_POLICY' ) {
        return (
          <span>
            { d.actionType === 'CHANGED_APPROVAL_POLICY' && <span style={{color:'#0CAD5D', marginRight:'15px'}}>{t('common.notification.status.approved')}</span>}
            { d.actionType === 'REJECTED_APPROVAL_POLICY' && <span style={{color:'#E03131', marginRight:'15px'}}>{t('common.notification.status.rejected')}</span>}
            <span> ({t('common.notification.status.changedApprovalPolicy')})</span>
          </span>
        )
      }
    }
    else if( d.pageType === 'POLICY_APPROVER') {    // 정책승인자 변동 알림
      const before: string[] = d.log.beforeUsers ? d.log.beforeUsers : []
      const after: string[] = d.log.afterUsers ? d.log.afterUsers : []

      const inUsers = after.filter(au => !before.some(bu => bu === au))     // 새로 추가된 정책승인자
      const outUsers = before.filter(bu => !after.some(au => bu === au))    // 해제된 정책승인자

      if(inUsers.length === 0) inUsers.push('-')
      if(outUsers.length === 0) outUsers.push('-')

      if( d.actionType === 'CHANGE_POLICY_APPROVER' ) {
        return (
          <span>
            <span style={{color:'#0CAD5D', marginRight:'15px'}}>{t('common.notification.desciption.in')}</span><span>{inUsers.join(', ')} </span>
            <span style={{color:'#E03131', marginLeft: '30px', marginRight:'15px'}}>{t('common.notification.desciption.out')}</span><span>{outUsers.join(', ')} </span>
          </span>
        )
      }
    }

    return 'Unknown'
  }

  /* 재정관리자 관련 알림 모음 중에서 해당되는 알림의 노드를 생성하여 반환한다. */
  const getFinancialManagerStatus = (d: any): React.ReactNode => {
    if( d.pageType === 'DRAFT') {
      if( d.actionType === 'APPROVED' ) return <span><span style={{color:'#0CAD5D'}}>{t('common.notification.status.approved')}</span></span>
      if( d.actionType === 'REJECTED' ) return <span><span style={{color:'#E03131'}}>{t('common.notification.status.rejected')}</span></span>
      if( d.actionType === 'POLICY_VIOLATED' ) return <span><span style={{color:'#FA9601'}}>{t('common.notification.status.policyViolation')}</span></span>
      if( d.actionType === 'CREATED' ) return <span>{t('common.notification.status.created.needApproval')}</span>
    }
    if( d.pageType === 'WALLET' ) {
      if( d.actionType === 'CHANGED_FINANCIAL_ADMIN' ) return <span>{t('common.notification.status.changedFinancialAdmin')}</span>
      if( d.actionType === 'CHANGED_WALLET_NAME' ) return <span>{t('common.notification.status.updated.needExport')}</span>
      if( d.actionType === 'CREATED_WALLET' ) return <span>{t('common.notification.status.createdWallet')}</span>
    }
    if( d.pageType === 'GLOBAL_POLICY' ) {
      if( d.actionType === 'ADDED_WHITELIST' || d.actionType === 'DELETED_WHITELIST'
        || d.actionType === 'CHANGED_WHITELIST_NAME' || d.actionType === 'CHANGED_GROUP' || d.actionType === 'CHANGED_GROUP_NAME') {
        return <span>{t('common.notification.status.whitelistUpdated')}</span>
      }
    }
    if( d.pageType === 'WALLET_POLICY' ) {
      if( d.actionType === 'CHANGE_REQUEST_VELOCITY_LIMIT') {
        return <span>{t('common.notification.status.needApproval')}</span>
      }
      if( d.actionType === 'CHANGE_REQUEST_APPROVAL_POLICY') {
        return <span>{t('common.notification.status.needApproval')}</span>
      }
      if( d.actionType === 'CHANGED_VELOCITY_LIMIT') {
        return (
          <span>
            {d.log.velocityLimitType === 'ONETIME' && <><span>{t('common.notification.status.onetime')}</span></>}
            {d.log.velocityLimitType === 'TIMEWINDOW_DAY' && <><span>{t('common.notification.status.timewindowDay')}</span></>}
            {d.log.velocityLimitType === 'TIMEWINDOW_WEEK' && <><span>{t('common.notification.status.timewindowWeek')}</span></>}
            {d.log.velocityLimitType === 'TIMEWINDOW_MONTH' && <><span>{t('common.notification.status.timewindowMonth')}</span></>}
          </span>
        )
      }
      if( d.actionType === 'CHANGED_APPROVAL_POLICY') {
        return <span>{t('common.notification.status.changedApprovalPolicy')}</span>
      }
    }

    return 'Unknown'
  }

  /* 현재 로그인된 사용자의 역할(props.userRole) 세 가지에 따라서 위의 세 가지 그룹(getFinancialManagerStatus) 중 해당되는 알림 노드 생성 로직을 선택한다.*/
  const getStatus = (d: any): any => {
    if( props.userRole === 'SYSTEM_MANAGER' ) {
      return getSystemManagerStatus(d)
    }
    if( props.userRole === 'POLICY_MANAGER' ) {
      return getPolicyManagerStatus(d)
    }
    if( props.userRole === 'FINANCE_MANAGER' ) {
      return getFinancialManagerStatus(d)
    }
  }

  const getTableColumns = () => {
    if( props.userRole === 'SYSTEM_MANAGER' ) {
      return [
        {title: 'Type', width: '20%', dataIndex: 'type', key: 'type'},
        {title: 'Status', width: '60%', dataIndex: 'status', key: 'status'},
        {title: 'Date', width: '20%', dataIndex: 'date', key: 'date'},
      ]
    }
    return [
      {title: '', width: '5%', dataIndex: 'isNew', key: 'isNew'},
      {title: 'Type', width: '30%', dataIndex: 'type', key: 'type'},
      {title: 'Status', width: '45%', dataIndex: 'status', key: 'status'},
      {title: 'Date', width: '20%', dataIndex: 'date', key: 'date'},
    ]
  }

  const ExpandIcon = (iconProps:ExpandIconProps<any>) => {
    const record = iconProps.record
    console.log(props.userRole,record.detail.pageType, record.detail.actionType )
    if( props.userRole === 'SYSTEM_MANAGER') return false
    if( props.userRole === 'POLICY_MANAGER' ) {
      if(record.detail.pageType === 'POLICY_APPROVER') return false
    }
    if( props.userRole === 'FINANCE_MANAGER' && record.detail.pageType === 'WALLET' && record.detail.actionType !== 'CHANGED_FINANCIAL_ADMIN' ) return false

    // @ts-ignore
    return (<Icon type={props.expanded ? "caret-up" : "caret-down"} onClick={e => iconProps.onExpand(record, e.nativeEvent)}/>)
  }


  return (
    <Modal
      title="Notifications"
      visible={visible}
      closable={true}
      onCancel={()=> props.visibleHandler(false)}
      width={1200}
      footer={<Button onClick={handleOk}>Close</Button>}
    >
      <Table
        columns={getTableColumns()}
        pagination={{total, pageSize:20, current:page, onChange:(p:number) => getMyNotifications(p)}}
        dataSource={data}
        expandedRowRender={LogDetail}
        expandIcon={ExpandIcon}
      />
    </Modal>
  )
}

const LogDetail = (data: any) => {
  const d = data.detail
  if( d.pageType === 'GLOBAL_POLICY' ) {
    if( d.action === 'ADDED_WHITELIST' ) {
      return (
        <Descriptions bordered={true} column={1}>
          <Descriptions.Item key={d.id + 'ADDED'} label={<span style={{color:'#0CAD5D'}}>{t('common.notification.status.added')}</span>}><span style={{fontWeight:'bolder'}}>{d.approvalId} {d.name}</span></Descriptions.Item>
          <Descriptions.Item key={d.id + 'ADDRESS'} label={t('common.notification.desciption.address')}>{d.address}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'GROUP'} label={t('common.notification.desciption.group')}>{d.groupName}</Descriptions.Item>
        </Descriptions>
      )
    }
    if( d.action === 'DELETED_WHITELIST' ) {
      return (
        <Descriptions bordered={true} column={1}>
          <Descriptions.Item key={d.id + 'DELETED'} label={<span style={{color:'#E03131'}}>{t('common.notification.status.deleted')}</span>}><span style={{fontWeight:'bolder'}}>{d.approvalId} {d.name}</span></Descriptions.Item>
          <Descriptions.Item key={d.id + 'ADDRESS'} label={t('common.notification.desciption.address')}>{d.address}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'GROUP'} label={t('common.notification.desciption.group')}>{d.groupName}</Descriptions.Item>
        </Descriptions>
      )
    }
    if( d.action === 'CHANGED_WHITELIST_NAME' ) {
      return (
        <Descriptions bordered={true} column={1}>
          <Descriptions.Item key={d.id + 'BEFORE'} label={t('common.notification.desciption.before')}>{d.beforeName}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'AFTER'} label={t('common.notification.desciption.after')}>{d.name}</Descriptions.Item>
        </Descriptions>
      )
    }
    if( d.action === 'CHANGED_GROUP' ) {
      return (
        <Descriptions bordered={true} column={1}>
          <Descriptions.Item key={d.id + 'NAME'} label={t('common.notification.desciption.name')}><span style={{fontWeight:'bolder'}}>{d.approvalId} {d.name}</span></Descriptions.Item>
          <Descriptions.Item key={d.id + 'BEFORE'} label={t('common.notification.desciption.before')}>{d.beforeGroupName}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'AFTER'} label={t('common.notification.desciption.after')}>{d.groupName}</Descriptions.Item>
        </Descriptions>
      )
    }
    if( d.action === 'CHANGED_GROUP_NAME' ) {
      // TODO: WHITE LIST 기획 살아나면 여기에 추가해야됨
      return (
        <Descriptions bordered={true} column={1}>
          <Descriptions.Item key={d.id} label="-">-</Descriptions.Item>
        </Descriptions>
      )
    }
  }
  else if( d.pageType === 'WALLET') {
    if( d.action === 'CHANGED_FINANCIAL_ADMIN' ) {
      const before: string[] = d.beforeUsers
      const after: string[] = d.afterUsers
      const inUsers = after.filter(au => !before.some(bu => bu === au))
      const outUsers = before.filter(bu => !after.some(au => bu === au))
      return (
        <Descriptions bordered={true} column={1}>
          <Descriptions.Item key={d.id + 'NAME'} label={t('common.notification.desciption.name')}>{d.coinWalletName}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'ADDRESS'} label={t('common.notification.desciption.address')}>{d.address}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'CURRENCY'} label={t('common.notification.desciption.currency')}>{d.walletType} {d.coinType} {d.walletType === 'TOKEN' ? d.tokenType : ''}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'IN'} label={<span style={{color:'#0CAD5D'}}>{t('common.notification.desciption.in')}</span>}>{inUsers.length > 0 ? inUsers.join(', ') : ''}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'OUT'} label={<span style={{color:'#E03131'}}>{t('common.notification.desciption.out')}</span>}>{outUsers.length > 0 ? outUsers.join(', ') : '-'}</Descriptions.Item>
        </Descriptions>
      )
    }
    if( d.action === 'CREATED_WALLET' ) {
      return (
        <Descriptions bordered={true} column={1}>
          <Descriptions.Item key={d.id + 'NAME'} label={t('common.notification.desciption.name')}>{d.coinWalletName}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'ADDRESS'} label={t('common.notification.desciption.address')}>{d.address}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'CURRENCY'} label={t('common.notification.desciption.currency')}>{d.walletType} {d.coinType} {d.walletType === 'TOKEN' ? d.tokenType : ''}</Descriptions.Item>
        </Descriptions>
      )
    }
    if( d.action === 'CHANGED_WALLET_NAME' ) {
      return (
        <Descriptions bordered={true} column={1}>
          <Descriptions.Item key={d.id + 'ADDRESS'} label={t('common.notification.desciption.address')}>{d.address}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'CURRENCY'} label={t('common.notification.desciption.currency')}>{d.walletType} {d.coinType} {d.walletType === 'TOKEN' ? d.tokenType : ''}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'BEFORE-NAME'} label={t('common.notification.desciption.before')}>{d.beforeCoinWalletName}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'NAME'} label={t('common.notification.desciption.after')}>{d.coinWalletName}</Descriptions.Item>
        </Descriptions>
      )
    }
  }
  else if( d.pageType === 'WALLET_POLICY' ) {
    if( d.action === 'CHANGED_VELOCITY_LIMIT' || d.action === 'REJECTED_VELOCITY_LIMIT'|| d.action === 'CHANGE_REQUEST_VELOCITY_LIMIT' ) {
      return (
        <Descriptions bordered={true} column={1}>
          <Descriptions.Item key={d.id + 'NAME'} label={t('common.notification.desciption.name')}>{d.coinWalletName}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'ADDRESS'} label={t('common.notification.desciption.address')}>{d.address}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'CURRENCY'} label={t('common.notification.desciption.currency')}>{d.walletType} {d.coinType} {d.walletType === 'TOKEN' ? d.tokenType : ''}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'BEFORE'} label={t('common.notification.desciption.before')}>
            {d.walletType === 'COIN' && <span><Currency.Amount amount={d.before} coinType={d.coinType}/></span>}
            {d.walletType === 'TOKEN' && <span><Currency.Amount amount={d.before} coinType={d.coinType} contractAddress={d.contractAddress} /></span>}
          </Descriptions.Item>
          <Descriptions.Item key={d.id + 'AFTER'} label={t('common.notification.desciption.after')}>
            {d.walletType === 'COIN' && <span><Currency.Amount amount={d.after} coinType={d.coinType}/></span>}
            {d.walletType === 'TOKEN' && <span><Currency.Amount amount={d.after} coinType={d.coinType} contractAddress={d.contractAddress} /></span>}
          </Descriptions.Item>
        </Descriptions>
      )
    }
    if( d.action === 'CHANGED_APPROVAL_POLICY' || d.action === 'REJECTED_APPROVAL_POLICY' || d.action === 'CHANGE_REQUEST_APPROVAL_POLICY' ) {
      return (
        <Descriptions bordered={true} column={1}>
          <Descriptions.Item key={d.id + 'NAME'} label={t('common.notification.desciption.name')}>{d.coinWalletName}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'ADDRESS'} label={t('common.notification.desciption.address')}>{d.address}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'CURRENCY'} label={t('common.notification.desciption.currency')}>{d.walletType} {d.coinType}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'BEFORE'} label={t('common.notification.desciption.before')}>{d.beforeUsers.join(', ')} <span style={{marginLeft:'50px'}}>* {t('common.notification.desciption.needCount')}: {d.beforeNeedCount}</span></Descriptions.Item>
          <Descriptions.Item key={d.id + 'AFTER'} label={t('common.notification.desciption.after')}>{d.afterUsers.join(', ')} <span style={{marginLeft:'50px'}}>* {t('common.notification.desciption.needCount')}: {d.afterNeedCount}</span></Descriptions.Item>
        </Descriptions>
      )
    }
  } else if (d.pageType === 'DRAFT') {
    if (d.action === 'CREATED' || d.action === 'DELETED') {
      return (
        <Descriptions bordered={true} column={2}>
          <Descriptions.Item key={d.id + 'FROM'} label={t('fm.logview.desciption.from')}>{d.fromAddress}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'AMOUNT'} label={t('fm.logview.desciption.amount')}>
            {d.walletType === 'COIN' &&
            <span><Currency.Amount amount={d.amount} coinType={d.coinType}/> {d.coinType}</span>}
            {d.walletType === 'TOKEN' && <span><Currency.Amount amount={d.amount} coinType={d.coinType} contractAddress={d.contractAddress} /></span>}
          </Descriptions.Item>
          <Descriptions.Item key={d.id + 'TO'} label={t('fm.logview.desciption.to')}>{d.toAddress}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'FEE'} label={t('fm.logview.desciption.fee')}>
            {d.walletType === 'COIN' &&
            <span><Currency.Amount amount={d.fee} coinType={d.coinType}/> {d.coinType}</span>}
            {d.walletType === 'TOKEN' && <span><Currency.Amount amount={d.fee} coinType={d.coinType} contractAddress={d.contractAddress} /></span>}
          </Descriptions.Item>
        </Descriptions>
      )
    }
    if (d.action === 'APPROVED' || d.action === 'REJECTED') {
      return (
        <Descriptions bordered={true} column={2}>
          <Descriptions.Item key={d.id + 'FROM'} label={t('fm.logview.desciption.from')}>{d.fromAddress}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'AMOUNT'} label={t('fm.logview.desciption.amount')}>
            {d.walletType === 'COIN' &&
            <span><Currency.Amount amount={d.amount} coinType={d.coinType}/> {d.coinType}</span>}
            {d.walletType === 'TOKEN' && <span><Currency.Amount amount={d.amount} coinType={d.coinType} contractAddress={d.contractAddress} /></span>}
          </Descriptions.Item>
          <Descriptions.Item key={d.id + 'TO'} label={t('fm.logview.desciption.to')}>{d.toAddress}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'FEE'} label={t('fm.logview.desciption.fee')}>
            {d.walletType === 'COIN' &&
            <span><Currency.Amount amount={d.fee} coinType={d.coinType}/> {d.coinType}</span>}
            {d.walletType === 'TOKEN' &&
            <span><Currency.Amount amount={d.fee} coinType={d.coinType} contractAddress={d.contractAddress} /></span>}
          </Descriptions.Item>
          <Descriptions.Item key={d.id + 'APPROVED'} label={<span style={{ color: '#0CAD5D' }}>{t('fm.logview.desciption.approved')}</span>}
                             span={3}>{d.approvedUsers.join(', ')}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'REJECTED'} label={<span style={{ color: '#E03131' }}>{t('fm.logview.desciption.rejected')}</span>}
                             span={3}>{d.rejectedUsers.join(', ')}</Descriptions.Item>
        </Descriptions>
      )
    }

    if (d.action === 'POLICY_VIOLATED') {
      return (
        <Descriptions bordered={true} column={2}>
          <Descriptions.Item key={d.id + 'FROM'} label={t('fm.logview.desciption.from')}>{d.fromAddress}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'AMOUNT'} label={t('fm.logview.desciption.amount')}>
            {d.walletType === 'COIN' &&
            <span><Currency.Amount amount={d.amount} coinType={d.coinType}/> {d.coinType}</span>}
            {d.walletType === 'TOKEN' && <span><Currency.Amount amount={d.amount} coinType={d.coinType} contractAddress={d.contractAddress} /></span>}
          </Descriptions.Item>
          <Descriptions.Item key={d.id + 'TO'} label={t('fm.logview.desciption.to')}>{d.toAddress}</Descriptions.Item>
          <Descriptions.Item key={d.id + 'FEE'} label={t('fm.logview.desciption.fee')}>
            {d.walletType === 'COIN' &&
            <span><Currency.Amount amount={d.fee} coinType={d.coinType}/> {d.coinType}</span>}
            {d.walletType === 'TOKEN' &&
            <span><Currency.Amount amount={d.fee} coinType={d.coinType} contractAddress={d.contractAddress} /></span>}
          </Descriptions.Item>
          <Descriptions.Item key={d.id + 'VIOLATED'} label={t('fm.logview.desciption.violated')} span={3}>{d.violatedType}</Descriptions.Item>
        </Descriptions>
      )
    }

  }

  return (
    <Descriptions bordered={true} column={1}>
      <Descriptions.Item key={d.id} label="-">-</Descriptions.Item>
    </Descriptions>
  )
}




export default NotificationModal
