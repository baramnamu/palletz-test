type LogPageType = 'GLOBAL_POLICY' | 'WALLET_POLICY' | 'WALLET' | 'DRAFT' | 'FINANCIAL_ADMIN' | 'POLICY_APPROVER' | 'BACKUP' | 'LOGIN_LOGOUT'

interface LogViewDecorator {
  newLog: boolean
  statusColor: string
}

interface DataWithLogPageType {
  pageType: LogPageType
  decorator?: LogViewDecorator
}

interface LogRow {
  key: string,
  type: string,
  detail?: DataWithLogPageType,
  status: string,
  date: string
}

interface LogFinancialAdmin extends DataWithLogPageType {
  pageType: 'FINANCIAL_ADMIN'
  userId: string
  loginId: string
  action: 'ADDED' | 'DELETED' | 'REPLACED_CARD'
}

interface FinancialAdminAdded extends LogFinancialAdmin {
  action: 'ADDED'
}

interface FinancialAdminDeleted extends LogFinancialAdmin {
  action: 'DELETED'
}

interface FinancialAdminReplacedCard extends LogFinancialAdmin {
  action: 'REPLACED_CARD'
}

interface LogPolicyApproval extends DataWithLogPageType {
  pageType: 'POLICY_APPROVER'
  beforeUsers: string
  afterUsers: string
  action: 'CHANGE_POLICY_APPROVER'
}

interface LogBackup extends DataWithLogPageType {
  pageType: 'BACKUP'
  action: 'BACKUP'
}

interface LogWallet extends DataWithLogPageType {
  pageType: 'WALLET'
  walletType: WalletType
  address: string
  coinWalletId: string
  coinType: string
  coinWalletName: string
  tokenTypeId: string
  tokenType: string
  action: 'CREATED_WALLET' | 'CHANGED_WALLET_NAME' | 'CHANGED_FINANCIAL_ADMIN'
}

interface WalletCreation extends LogWallet {
  action: 'CREATED_WALLET'
}

interface ChangedWalletName extends LogWallet {
  action: 'CHANGED_WALLET_NAME'
  beforeCoinWalletName: string
}

interface ChangedFinancialAdmin extends LogWallet {
  action: 'CHANGED_FINANCIAL_ADMIN'
  beforeUsers: string[]
  afterUsers: string[]
}

interface LogGlobalPolicy extends DataWithLogPageType {
  pageType: 'GLOBAL_POLICY'
  whiteListId: string
  approvalId: number
  name: string
  address: string
  groupId: string
  groupName: string
  action: 'ADDED_WHITELIST' | 'REJECTED_WHITELIST' | 'DELETED_WHITELIST' | 'CHANGED_WHITELIST_NAME' | 'CHANGED_GROUP' | 'CHANGED_GROUP_NAME'
}

interface AddedWhiteList extends LogGlobalPolicy {
  action: 'ADDED_WHITELIST'
}

interface RejectedWhiteList extends LogGlobalPolicy {
  action: 'REJECTED_WHITELIST'
}

interface DeletedWhiteList extends LogGlobalPolicy {
  action: 'DELETED_WHITELIST'
}

interface ChangedWhiteListName extends LogGlobalPolicy {
  action: 'CHANGED_WHITELIST_NAME'
  beforeName: string
}

interface ChangedGroup extends LogGlobalPolicy {
  action: 'CHANGED_GROUP'
  beforeGroupId: string
  beforeGroupName: string
}

interface ChangeGroupName extends LogGlobalPolicy {
  action: 'CHANGED_GROUP_NAME'
  beforeGroupName: string
}

type WalletType = 'COIN' | 'TOKEN'

interface LogWalletPolicy extends DataWithLogPageType {
  pageType: 'WALLET_POLICY'
  walletType: WalletType
  coinWalletId: string
  coinType: string
  coinWalletName: string
  address: string
  tokenTypeId: string
  tokenType: string
  action: 'CHANGED_VELOCITY_LIMIT' | 'REJECTED_VELOCITY_LIMIT' | 'CHANGED_APPROVAL_POLICY' | 'REJECTED_APPROVAL_POLICY'
}

type VelocityLimitType = 'ONETIME' | 'TIMEWINDOW_DAY' | 'TIMEWINDOW_WEEK' | 'TIMEWINDOW_MONTH'

interface ChangedVelocityLimit extends LogWalletPolicy {
  action: 'CHANGED_VELOCITY_LIMIT'
  velocityLimitType: VelocityLimitType
  before: string
  after: string
}

interface RejectedVelocityLimit extends LogWalletPolicy {
  action: 'REJECTED_VELOCITY_LIMIT'
  velocityLimitType: VelocityLimitType
  before: string
  after: string
}

interface ChangedApprovalPolicy extends LogWalletPolicy {
  action: 'CHANGED_APPROVAL_POLICY'
  beforeNeedCount: number
  afterNeedCount: number
  beforeUsers: string[]
  afterUsers: string[]
}

interface RejectedApprovalPolicy extends LogWalletPolicy {
  action: 'REJECTED_APPROVAL_POLICY'
  beforeNeedCount: number
  afterNeedCount: number
  beforeUsers: string[]
  afterUsers: string[]
}

interface LogLoginOrLogout extends DataWithLogPageType {
  pageType: 'LOGIN_LOGOUT'
  action: 'LOGIN' | 'LOGOUT'
}

interface LogDraft extends DataWithLogPageType {
  pageType: 'DRAFT'
  walletType: WalletType
  requester: string
  coinWalletId: string
  coinWalletName: string
  coinType: string
  tokenType: string
  amount: string
  feeAmount: string
  unitPrice: string
  fromAddress: string
  toAddress: string
  action: 'CREATED' | 'APPROVED' | 'REJECTED' | 'POLICY_VIOLATED' | 'DELETED'
}

interface ApproveOrReject extends LogDraft {
  action: 'APPROVED' | 'REJECTED'
  approvedUsers: string[]
  rejectedUsers: string[]
}

interface Created extends LogDraft {
  action: 'CREATED'
}

interface Deleted extends LogDraft {
  action: 'DELETED'
}

type TxApprovalResult =
  'APPROVED' |
  'REJECTED' |
  'DELETED' |
  'FAILED' |
  'PENDING' |
  'POLICY_VIOLATION_WHITE_LIST' |
  'POLICY_VIOLATION_VELOCITY_ONETIME' |
  'POLICY_VIOLATION_VELOCITY_DAY' |
  'POLICY_VIOLATION_VELOCITY_WEEK' |
  'POLICY_VIOLATION_VELOCITY_MONTH'

interface ViolatedPolicy extends LogDraft {
  action: 'POLICY_VIOLATED'
  violatedType: TxApprovalResult
}

type LogView =
  FinancialAdminAdded |
  FinancialAdminDeleted |
  FinancialAdminReplacedCard |
  LogPolicyApproval |
  LogBackup |
  WalletCreation |
  ChangedWalletName |
  ChangedFinancialAdmin |
  AddedWhiteList |
  RejectedWhiteList |
  DeletedWhiteList |
  ChangedWhiteListName |
  ChangedGroup |
  ChangeGroupName |
  ChangedVelocityLimit |
  RejectedVelocityLimit |
  ChangedApprovalPolicy |
  RejectedApprovalPolicy |
  LogLoginOrLogout |
  ApproveOrReject |
  Created |
  Deleted |
  ViolatedPolicy
