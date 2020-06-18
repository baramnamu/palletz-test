type WalletExportedType = 'NEW' | 'OLD' | 'UPDATED' | 'DELETED'

interface Pageable<T> {
  content: T[],
  totalElements: number
}

interface LogViewResponse {
  id: string
  pageType: LogPageType,
  actionType: string,
  log: string,
  requesterId: string,
  createdAt: string
}

interface CheckPolicyResponse {
  id: string
  velocityLimitType: VelocityLimitType
}

interface FinancialManagerResponse {
  id: string
  loginId: string
  name: string
  createdAt: string
}

interface SmartCardResetResponse {
  loginId: string
  userName: string
  cardId: string
  productName: string
  productId: string
}
