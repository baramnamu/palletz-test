import axios, { AxiosResponse } from 'axios'
// import { DraftType, TransactionDTO } from './pages/FinanceManager/TxProgressDraft'
import { WalletExportData } from 'pzsc/dist/common'
import { UserRole } from './constants'


export interface LoginResponse {
  userId: string
  loginId: string,
  sessionKey: string,
  name: string,
  userRole: UserRole,
  policyApprover: boolean
}

export interface UserResponse {
  id: string,
  loginId: string,
  name: string,
  createdAt: Date
}

// export interface WalletResponse {
//   id: string,
//   walletId: string,
//   coinType: string,
//   name: string
//   address: string,
//   velocities: { [key: string]: string },
//   needCount: number
//   approvalUsers: string[]
//   tokens?: {
//     walletId: string,
//     symbol: string
//   }[]
//   exportedType: WalletExportedType
// }

// export interface WalletHistoryResponse {
//   id: string
//   feeAmount: string
//   unitPrice: string
//   toAddress: string
//   approvalResult: TxApprovalResult
//   amount: string
// }

export interface WhitelistDetailUpdateRequest {
  id: string,
  name: string,
  groupId: string,
  groupName?: string
}

export interface TxResponse {
  id: string,
  coinType: string,
  walletName: string,
  amount: number,
  fee: number,
  fromAddress: string,
  toAddress: string,
  requesterName: string,
  requesterId: string,
  approvalResult: string
}

export interface WhitelistGroupResponse {
  id: string,
  name: string,
  count: number
}

export interface WhitelistResponse {
  id: string,
  approvalId: number,
  name: string,
  listGroupText: string,
  walletAddress: string,
  createdAt: string,
  approvedAt: string,
  groupId: string,
  groupName: string,
  coinType: string
}

export interface VelocityLimitResponse {
  id: string,
  coinName: string,
  tokenName: string,
  velocityLimitType: string,
  contractAddress: string
  tokenSymbol: string
  tokenType: string // Platform of token
  coinType: string,
  walletType: string
}

export interface WhitelistDetailResponse {
  id: string,
  name: string,
  createdAt: Date,
  approvedAt: Date,
  groupId: string,
  groupName: string,
  approveUsers: any[]
}

export interface ApprovalUserPolicyResponse {
  walletCoinId: string,
  policyId: string,
  name: string,
  coinType: string,
  walletType: string
}

export interface MnemonicNewWalletGenerateRequest {
  entropySize: number,
  needCount: number,
  totalCount: number
}

export interface MnemonicNewWalletGenerateResponse {
  verificationCode: string
}

export interface MnemonicNewWalletShowRequest {
  verificationCode: string
  verifyStep: number
}

export interface MnemonicNewWalletShowResponse {
  mnemonicWords: string[]
}

export interface MnemonicNewWalletVerifyRequest {
  step: number
  mnemonic: string[]
}

export interface MnemonicNewWalletVerifyResponse {
  notMatchedWords: number[]
}

export interface MnemonicRestorationPrepareRequest extends MnemonicNewWalletGenerateRequest {
  entropySize: number
  needCount: number
  totalCount: number
}

export interface MnemonicRestorationPrepareResponse {
  // Empty
}

export interface MnemonicRestorationConfirmRequest {
  mnemonicWords: string[]
  verifyStep: number
}

export interface MnemonicRestorationConfirmResponse {
  success: boolean
}

export interface MnemonicRestorationCombineRequest {
  // Empty
}

export interface MnemonicRestorationCombineResponse {
  verificationCode: string
  success: boolean
}

export interface WalletCreationRequest {
  walletName: string
  coinType: string
  approvalNeedCount: number
  approvalUserIds: string[]
  walletAdminUserIds: string[]
  velocities: any[]
}

export interface TokenWalletCreationRequest {
  walletId: string
  contractAddress: string
  velocities: any[]
}

export interface WalletCreationResponse {
  address: string
  success: boolean
}

export interface WalletPolicySearchResponse {
  id: string,
  name: string,
  address: string,
  coinType: string,
  tokens: string[]
}

export interface VelocityLimit {
  id: string,
  velocityLimitType: string,
  velocityLimitSize: string,
  approvalStatus: string
}

export interface RequestedVelocityLimit extends VelocityLimit {
  approveUsers: { id: string, name: string, approvalStatus: string }[]
}

export interface WalletPolicyDetailResponse {
  id: string,
  name: string,
  address: string,
  coinType: string
  needCount: number,
  hasToken: boolean,
  pendingWalletPolicy: boolean,
  requestedNeedCount: number,
  tokens: {
    tokenId: string,
    symbol: string,
    velocityLimits: VelocityLimit[],
    requestedVelocityLimits: RequestedVelocityLimit[]
    contractAddress: string
  }[],
  approveUsers: { id: string, name: string, approvalStatus: string }[],
  walletAdminList: UserResponse[],
  walletApprovers: UserResponse[],
  velocityLimits: VelocityLimit[],
  requestedVelocityLimits: RequestedVelocityLimit[],
  requestedWalletApproverList: UserResponse[]
}

export interface RefData {
  approvalId: number,
  name: string,
  groupName: string,
  coinType: string,
  tokenType: string,
  action: string,
  beforeCoin: string,
  afterCoin: string,
  symbol: string
}

export interface ApiLogResponse {
  id: string,
  log: string,
  pageType: string,
  logType: string,
  createdAt: Date
}

export type WalletAdminUser = {
  userId: string,
  hasApproveAuth: boolean
}

interface WalletUserUpdateRequest {
  needCount: number,
  adminUsers: WalletAdminUser[]
}

export interface WalletNameCheckResponse {
  ok: boolean
}

// export interface TransactionListResponse {
//   transactions: TransactionDTO[]
// }

// export interface WalletListResponse {
//   wallets: WalletResponse[]
//   deleted: WalletResponse[]
// }

export interface WalletData extends WalletExportData {
  old: boolean
}

// export interface TransactionExport {
//   id: string,
//   rawTransactionHex: string,
//   finalizedAt: string,
//   approvalResult: TxApprovalResult,
//   extra: string,
//   draft: string
// }

export interface VelocityLimitDetailResponse {
  before: string,
  after: string,
  coinType: string,
  tokenType?: string
}

export interface SessionInfo {
  loginId: string,
  name: string,
  policyApprover: boolean,
  sessionKey: string,
  userId: string,
  userRole: UserRole
}

export interface SmartCardInitData {
  productId: string
  productName: string
  userId: string,
  cardId: string,

  // field for isReset === true
  loginId: string,
  userName: string
}

const baseUrl = 'http://127.0.0.1:9088/api'

const Api = {
  common: {
    systemStatus: (): Promise<AxiosResponse<{ [key: string]: boolean }>> => axios.get(`${baseUrl}/setup/system-init-status`),
    // coinInfos: (): Promise<AxiosResponse<{ coins: CoinInformation[], tokens: TokenInformation[] }>> => axios.get(`${baseUrl}/common/coins/context`),
    // addCustomToken: (t: TokenInformation): Promise<AxiosResponse<boolean>> => axios.post(`${baseUrl}/common/coins/custom`, t),
    getFreeUUID: (): Promise<AxiosResponse<string>> => axios.get(`${baseUrl}/user/free-uuid`),
    restore: (path: string): Promise<AxiosResponse<string>> => axios.post(`${baseUrl}/common/restore`, { path })
  },
  session: {
    get: (): Promise<AxiosResponse<SessionInfo>> => axios.post(`${baseUrl}/user/info`),
    login: (dto: {}): Promise<AxiosResponse<LoginResponse>> => axios.post(`${baseUrl}/user/login`, dto),
    logout: () => axios.delete(`${baseUrl}/user/logout`),
    checkValidPassword: (
      o: {
        loginId: string,
        password: string
      }
    ): Promise<AxiosResponse<{ status: 'ok' | 'fail' }>> =>
      axios.post(`${baseUrl}/user/check-password`, o)
  },
  notification: {
    myNotifications: (page: number = 0, size: number = 20) => axios.get(`${baseUrl}/notification/my-notifications?page=${page}&size=${size}`),
    hasNewNotifications: (): Promise<AxiosResponse<{ hasNewNotifications: boolean }>> => axios.get(`${baseUrl}/notification/has-new-notifications`)
  },
  adminSetup: {
    update: (dto: {}) => axios.put(`${baseUrl}/admin/update`, dto),
    checkAdminAccount: (dto: {}) => axios.post(`${baseUrl}/admin/check-account`, dto)
  },
  crypto: {
    mnemonic: {
      newWallet: {
        generate: (dto: MnemonicNewWalletGenerateRequest) =>
          axios.post<MnemonicNewWalletGenerateResponse>(`${baseUrl}/crypto/mnemonic/new-wallet/generate`, dto),
        show: (dto: MnemonicNewWalletShowRequest): Promise<AxiosResponse<MnemonicNewWalletShowResponse>> =>
          axios.post(`${baseUrl}/crypto/mnemonic/new-wallet/show`, dto),
        verify: (dto: MnemonicNewWalletVerifyRequest) =>
          axios.post<MnemonicNewWalletVerifyResponse>(`${baseUrl}/crypto/mnemonic/new-wallet/verify`, dto)
      },
      restoration: {
        prepare: (dto: MnemonicRestorationPrepareRequest) =>
          axios.post<MnemonicRestorationPrepareResponse>(`${baseUrl}/crypto/mnemonic/restoration/prepare`, dto),
        confirm: (dto: MnemonicRestorationConfirmRequest) =>
          axios.post<MnemonicRestorationConfirmResponse>(`${baseUrl}/crypto/mnemonic/restoration/confirm`, dto),
        combine: (dto: MnemonicRestorationCombineRequest) =>
          axios.post<MnemonicRestorationCombineResponse>(`${baseUrl}/crypto/mnemonic/restoration/combine`, dto)
      }
    }
  },
  systemAdmin: {
    // search: (
    //   page: number = 0,
    //   size: number = 20,
    //   sort: string = 'createdAt,desc'
    // ): Promise<AxiosResponse<Pageable<FinancialManagerResponse>>> =>
    //   axios.get(`${baseUrl}/system-admin/financial-manager/search?page=${page}&sort=${sort}&size=${size}`),
    policyApprovers: () => axios.get(`${baseUrl}/system-admin/policy-approvers`),
    existsById: (id: string = '') => axios.get(`${baseUrl}/system-admin/financial-manager/exists?loginId=${encodeURIComponent(id)}`),
    createUser: (dto: any) => axios.post(`${baseUrl}/system-admin/financial-manager`, dto),
    updatePolicyApprovers: (userIds: string[]) => axios.put(`${baseUrl}/system-admin/update-policy-approvers`, userIds),
    removeUser: (id: string) => axios.delete(`${baseUrl}/system-admin/financial-manager/${id}`),
    logs: (page: number = 0, types: string[]): Promise<AxiosResponse<any>> =>
      axios.get(`${baseUrl}/system-admin/logs`, {
        params: {
          page,
          types,
          size: 10
        }
      }),
    migration: {
      reset: (password: string): Promise<AxiosResponse<void>> => axios.post(`${baseUrl}/migration/reset`, { password }),
      getUUID: (): Promise<AxiosResponse<string[]>> => axios.get(`${baseUrl}/migration/get-uuid`),
      backup: (): Promise<AxiosResponse<string>> => axios.post(`${baseUrl}/migration/backup`),
      restore: (loginId: string, password: string): Promise<AxiosResponse<void>> => axios.post(`${baseUrl}/migration/restore`, {
        loginId,
        password
      }),
      copyDumpFile: (path: string): Promise<AxiosResponse<string>> =>
        axios.post(`${baseUrl}/migration/copy-dump-file`, { path }),
      extractDumpFile: (): Promise<AxiosResponse<string[]>> =>
        axios.get(`${baseUrl}/migration/extract-dump-file`)
    }
  },
  financeManager: {
    approvePolicy: (
      whitelistIds: string[], velocityLimitIds: string[], approveUserPolicyIds: string[], approve: boolean
    ) => axios.post(`${baseUrl}/finance-manager/policy-approval`, {
      whitelistIds,
      velocityLimitIds,
      approveUserPolicyIds,
      approve
    }),
    myUnapprovalGlobalWhitelist: (page: number = 0): Promise<AxiosResponse<any>> => axios.get(`${baseUrl}/finance-manager/global-whitelist/my-unapproved?page=${page}`),
    myUnapprovalVelocityLimit: (page: number = 0): Promise<AxiosResponse<any>> => axios.get(`${baseUrl}/finance-manager/velocity-limit/my-unapproved?page=${page}`),
    myUnapprovalWalletApprovalUser: (page: number = 0): Promise<AxiosResponse<any>> => axios.get(`${baseUrl}/finance-manager/wallet-approval-user/my-unapproved?page=${page}`),
    unapprovalVelocityLimitDetail: (
      id: string,
      walletType: string,
      velocityLimitType: string
    ): Promise<AxiosResponse<any>> =>
      axios.get(`${baseUrl}/finance-manager/velocity-limit/my-unapproved/detail?id=${id}&walletType=${walletType}&velocityLimitType=${velocityLimitType}`),
    unApprovalUserPolicyDetail: (walletCoinId: string): Promise<AxiosResponse<any>> => axios.get(`${baseUrl}/finance-manager/wallet-approval-user/my-unapproved/detail?walletCoinId=${walletCoinId}`),
    // myWallets: (): Promise<AxiosResponse<WalletListResponse>> => axios.get(`${baseUrl}/finance-manager/my-wallets`),
    // walletHistories: (
    //   walletId: string,
    //   page: number = 0,
    //   q: string
    // ): Promise<AxiosResponse<Pageable<WalletHistoryResponse>>> =>
    //   axios.get(`${baseUrl}/finance-manager/wallet-histories/${walletId}?size=7&page=${page}&q=${q}`),
    approveTransaction: (txIds: string[], approve: boolean) => axios.post(`${baseUrl}/finance-manager/tx/approve`, {
      txIds,
      approve
    }),
    logs: (page: number = 0, types: string[]): Promise<AxiosResponse<any>> => axios.get(`${baseUrl}/finance-manager/logs`, {
      params: {
        page,
        types,
        size: 10
      }
    }),
    // checkPolicy: (txIds: string[], approve: boolean): Promise<AxiosResponse<CheckPolicyResponse[]>> => axios.post(`${baseUrl}/finance-manager/tx/check-policy`, {
    //   txIds,
    //   approve
    // })
  },
  policyManager: {
    wallet: {
      // search: (page: number = 0, size: number = 10): Promise<AxiosResponse<Pageable<WalletPolicySearchResponse>>> =>
      //   axios.get(`${baseUrl}/policy/wallet/search?page=${page}&size=${size}`),
      detail: (walletId: string): Promise<AxiosResponse<WalletPolicyDetailResponse>> => axios.get(`${baseUrl}/policy/wallet/${walletId}`),
      updateWalletApprovers: (id: string, dto: WalletUserUpdateRequest) => axios.put(`${baseUrl}/policy/wallet/${id}/approvers`, dto),
      updateWalletUsers: (id: string, userIds: WalletAdminUser[]) => axios.put(`${baseUrl}/policy/wallet/${id}/admin-list`, userIds),
      updateVelocityLimit: (id: string, velocityLimit: VelocityLimit) => axios.put(`${baseUrl}/policy/wallet/${id}/velocity-limit`, velocityLimit),
      updateTokenVelocityLimit: (id: string, tokenId: string, v: VelocityLimit) => axios.put(`${baseUrl}/policy/wallet/${id}/token/${tokenId}/velocity-limit`, v),
      expireWalletApprover: (id: string) => axios.delete(`${baseUrl}/policy/wallet/${id}`),
      expireVelocity: (id: string, velocityLimitId: string) => axios.delete(`${baseUrl}/policy/wallet/${id}/velocity-limit/${velocityLimitId}`),
      expireTokenVelocity: (id: string, tokenId: string, velocityLimitId: string) => axios.delete(`${baseUrl}/policy/wallet/${id}/token/${tokenId}/velocity-limit/${velocityLimitId}`),
      updateName: (id: string, name: string) => axios.put(`${baseUrl}/policy/wallet/${id}`, { name }),
      checkName: (name: string) => axios.post<WalletNameCheckResponse>(`${baseUrl}/wallet/check-name`, { name })
    },
    globalWhitelists: (page: number = 0, type: string = 'DATE'): Promise<AxiosResponse<any>> => axios.get(`${baseUrl}/policy-manager/global-whitelists?type=${type}&page=${page}`),
    unapprovedGlobalWhitelists: (page: number = 0): Promise<AxiosResponse<any>> => axios.get(`${baseUrl}/policy-manager/global-whitelists/unapproved?page=${page}`),
    whitelistDetail: (policyId: string): Promise<AxiosResponse<WhitelistDetailResponse>> => axios.get(`${baseUrl}/policy-manager/global-whitelists/${policyId}`),
    removeGlobalWhitelist: (id: string) => axios.delete(`${baseUrl}/policy-manager/global-whitelists/${id}`),
    createWhitelistPolicy: (dto: {}) => axios.post(`${baseUrl}/policy-manager/global-whitelists`, dto),
    updateWhitelistDetail: (dto: WhitelistDetailUpdateRequest) => axios.put(`${baseUrl}/policy-manager/global-whitelists/${dto.id}`, dto),
    whitelistGroupList: (query: string = ''): Promise<AxiosResponse<WhitelistGroupResponse[]>> => axios.get(`${baseUrl}/policy-manager/whitelist-groups?q=${query}`),
    createWhitelistGroup: (dto: {}) => axios.post(`${baseUrl}/policy-manager/whitelist-groups`, dto),
    updateWhiteListGroupName: (groupId: string, dto: { name: string }) => axios.put(`${baseUrl}/policy-manager/whitelist-groups/${groupId}`, dto),
    checkLogin: (dto: {}) => axios.post(`${baseUrl}/policy-manager/check-login`, dto),
    existWhitelistGroup: (name: string) =>
      axios.get(`${baseUrl}/policy-manager/whitelist-groups/exists`, { params: { name } }),
    existGlobalWhitelistPolicy: (address: string, coinType: string) => axios.get(`${baseUrl}/policy-manager/global-whitelists/exists`, {
      params: {
        address,
        coinType
      }
    }),
    createWallet: (dto: WalletCreationRequest) => axios.post<WalletCreationResponse>(`${baseUrl}/wallet/create`, dto),
    createTokenWallet: (dto: TokenWalletCreationRequest) => axios.post<WalletCreationResponse>(`${baseUrl}/wallet/token/create`, dto),
    // logs: (page: number = 0, types: string[]): Promise<AxiosResponse<Pageable<LogViewResponse>>> => axios.get(`${baseUrl}/policy-manager/logs`, {
    //   params: {
    //     page,
    //     types,
    //     size: 10
    //   }
    // })
  },
  transaction: {
    get: {
      // draft: (draftType: DraftType): Promise<AxiosResponse<TransactionListResponse>> =>
      //   axios.post(`${baseUrl}/transaction/get/draft`, { draftType }),
      // approved: (
      //   isTransmit: boolean,
      //   page: number,
      //   size: number = 7,
      //   q: string
      // ): Promise<AxiosResponse<Pageable<TransactionDTO>>> =>
      //   axios.get(`${baseUrl}/transaction/get/approved-transactions/${isTransmit}?size=${size}&page=${page}&q=${q}`)
    },
    delete: {
      approvedDraft: (ids: string[]): Promise<AxiosResponse<void>> =>
        axios.delete(`${baseUrl}/transaction/drafts`, {
          data: {
            ids
          }
        })
    }
  },
  sc: {
    transmit: {
      tx: (ids: string[], transmit: boolean): Promise<AxiosResponse<{ status: string }>> =>
        axios.post(`${baseUrl}/sc/transmit/tx`, { ids, transmit }),
      wallet: (ids: string[], transmit: boolean): Promise<AxiosResponse<{ status: string }>> =>
        axios.post(`${baseUrl}/sc/transmit/wallet`, { ids, transmit })
    },
    export: {
      // tx: (ids: string[]): Promise<AxiosResponse<TransactionExport[]>> =>
      //   axios.post(`${baseUrl}/sc/export/tx`, {
      //     ids,
      //     transmit: false
      //   }),
      // wallet: (): Promise<AxiosResponse<WalletListResponse>> =>
      //   axios.get(`${baseUrl}/sc/export/wallet`)
    },
    import: {
      tx: (msg: object[]): Promise<AxiosResponse<{ status: string }>> =>
        axios.post(`${baseUrl}/sc/import/tx`, msg)
    },
    initData: (): Promise<AxiosResponse<SmartCardInitData>> =>
      axios.get(`${baseUrl}/sc/smartcard-init`),
    verifyCard: (cardId: string): Promise<AxiosResponse<boolean>> =>
      axios.post(`${baseUrl}/sc/verify-card`, { cardId }),
    // replaceCard: (userId: string): Promise<AxiosResponse<SmartCardResetResponse>> =>
    //   axios.post(`${baseUrl}/sc/replace-card`, { userId })
  }
}

export default Api
