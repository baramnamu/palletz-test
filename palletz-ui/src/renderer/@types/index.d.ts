interface SvgrComponent extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {
}

declare module 'qrcode/build/qrcode.min' {
  export function toString(s: string, opts: {}, fn: (err: any, s: string) => void): any
}

type KvMap<T> = { [k: string]: T }

type CoinInformation = {
  precision: number
  alias: string
  symbol: string
  testNet: boolean
  hasToken: boolean
  hasUtxo: boolean
  feeStrategy: 'ONLY_PRICE' | 'LIMIT_AND_PRICE'
  unit: string
}

type TokenInformation = {
  precision: number
  baseCoin: string
  symbol: string
  alias: string
  contractAddress: string
}

// key of coins = CoinInformation.symbol
// k1 of tokens = TokenInformation.baseCoin, k2 of tokens = TokenInformation.symbol
type CoinInformationContext = {
  coins: KvMap<CoinInformation>
  tokens: KvMap<KvMap<TokenInformation>>
}

declare module '*.svg' {
  const value: SvgrComponent
  export default value
}

type SmartCardModalProps = {
  label: React.ReactNode
  okText?: string
  onOk: (word?: string) => Promise<void>
  onCancel?: () => void
  disabled?: boolean
  visible?: boolean
  style?: React.CSSProperties
  type?: 'primary' | 'danger'
  mode?: 'default' | 'init' | 'reset'
  size?: 'default' | 'large' | 'small'
  listener?: string
  loginId?: string
}

interface MnemonicInformation {
  entropySize: [number, number] // [Entropy Size, Word Count]
  totalCount: number
  needCount: number
}

interface VerifyInformation {
  code: string
  verifyStep: number
  sequence: 'new' | 'restoration'
  currentStep: number
}

interface AdminDTO {
  loginId: string
  password: string
  newPassword: string
  uuid: string
}

interface AdminInformation {
  system: AdminDTO
  policy: AdminDTO
}

type ValidationStatus = "success" | "warning" | "error" | "validating" | ""
