import * as React from 'react'
import Unfold from './Unfold.svg'
import Remove from './Remove.svg'
import Draft from './Draft.svg'
import ETH from './ETH.svg'
import Add from './Add.svg'
import Logout from './Logout.svg'
import Alert from './Alert.svg'
import History from './History.svg'
import DraftIncome from './DraftIncome.svg'
import Fold from './Fold.svg'
import WalletExport from './WalletExport.svg'
import LockDisabled from './LockDisabled.svg'
import Rejected from './Rejected.svg'
import User from './User.svg'
import Removed from './Removed.svg'
import ETHT from './ETHT.svg'
import Reset from './Reset.svg'
import BTC from './BTC.svg'
import BTCT from './BTCT.svg'
import Info from './Info.svg'
import Approver from './Approver.svg'
import Administration from './Administration.svg'
import Backup from './Backup.svg'
import Setting from './Setting.svg'
import WalletList from './WalletList.svg'
import Delete from './Delete.svg'
import Sync from './Sync.svg'
import Check from './Check.svg'
import Admin from './Admin.svg'
import Edit from './Edit.svg'
import GlobalPolicy from './GlobalPolicy.svg'
import DraftApproved from './DraftApproved.svg'
import PolicyApproval from './PolicyApproval.svg'
import Log from './Log.svg'
import List from './List.svg'
import Wallet from './Wallet.svg'
import Time from './Time.svg'
import Policy from './Policy.svg'
import Search from './Search.svg'
import WalletAdd from './WalletAdd.svg'
import { Icon } from 'antd'

const iconMap: KvMap<any> = {
  'Unfold': (props: any) => <Unfold {...props}/>,
  'Remove': (props: any) => <Remove {...props}/>,
  'Draft': (props: any) => <Draft {...props}/>,
  'ETH': (props: any) => <ETH {...props}/>,
  'Add': (props: any) => <Add {...props}/>,
  'Logout': (props: any) => <Logout {...props}/>,
  'Alert': (props: any) => <Alert {...props}/>,
  'History': (props: any) => <History {...props}/>,
  'DraftIncome': (props: any) => <DraftIncome {...props}/>,
  'Fold': (props: any) => <Fold {...props}/>,
  'WalletExport': (props: any) => <WalletExport {...props}/>,
  'LockDisabled': (props: any) => <LockDisabled {...props}/>,
  'Rejected': (props: any) => <Rejected {...props}/>,
  'User': (props: any) => <User {...props}/>,
  'Removed': (props: any) => <Removed {...props}/>,
  'ETHT': (props: any) => <ETHT {...props}/>,
  'Reset': (props: any) => <Reset {...props}/>,
  'BTC': (props: any) => <BTC {...props}/>,
  'BTCT': (props: any) => <BTCT {...props}/>,
  'Info': (props: any) => <Info {...props}/>,
  'Approver': (props: any) => <Approver {...props}/>,
  'Administration': (props: any) => <Administration {...props}/>,
  'Backup': (props: any) => <Backup {...props}/>,
  'Setting': (props: any) => <Setting {...props}/>,
  'WalletList': (props: any) => <WalletList {...props}/>,
  'Delete': (props: any) => <Delete {...props}/>,
  'Sync': (props: any) => <Sync {...props}/>,
  'Check': (props: any) => <Check {...props}/>,
  'Admin': (props: any) => <Admin {...props}/>,
  'Edit': (props: any) => <Edit {...props}/>,
  'GlobalPolicy': (props: any) => <GlobalPolicy {...props}/>,
  'DraftApproved': (props: any) => <DraftApproved {...props}/>,
  'PolicyApproval': (props: any) => <PolicyApproval {...props}/>,
  'Log': (props: any) => <Log {...props}/>,
  'List': (props: any) => <List {...props}/>,
  'Wallet': (props: any) => <Wallet {...props}/>,
  'Time': (props: any) => <Time {...props}/>,
  'Policy': (props: any) => <Policy {...props}/>,
  'Search': (props: any) => <Search {...props}/>,
  'WalletAdd': (props: any) => <WalletAdd {...props}/>,
}

type Props = {
  type: string,
  className?: string,
  width?: number,
  height?: number,
  viewBox?: string,
  onClick?: () => void,
  style?: React.CSSProperties
}

const PzIcon: React.FC<Props> = (props) => {
  const CustomIcon = iconMap[props.type]

  if (props.width) {
    return (
      <Icon
        onClick={props.onClick}
        style={props.style}
        component={() =>
          <CustomIcon
            className={props.className}
            width={props.width}
            height={props.height}
            viewBox={props.viewBox}
          />
        }
      />
    )
  }

  return (
    <Icon
      onClick={props.onClick}
      style={props.style}
      component={() =>
        <CustomIcon
          className={props.className}
          viewBox={props.viewBox}
        />
      }
    />
  )
}

export default PzIcon
