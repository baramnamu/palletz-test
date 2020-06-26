import * as React from 'react'
import Decimal from 'decimal.js'
import { CoinContext } from '../Application'

const pow = (precision: number) => new Decimal(10).pow(precision)

/**
 * 최소 단위에서 통용 단위로 변환
 * SATOSHI -> BTC
 * WEI -> ETH
 * @param amount 최소 단위
 * @param precision 정확도
 */
const toCurrency = (amount: string | number, precision: number): Decimal =>
  new Decimal(amount).div(pow(precision))

/**
 * 통용 단위를 최소 단위로 변환
 * BTC -> SATOSHI
 * ETH -> WEI
 * @param amount 통용 단위
 * @param precision 정확도
 */
export const toUnit = (amount: string, precision: number): Decimal =>
  new Decimal(amount).mul(pow(precision))

// Amount를 출력할 때 간편하게 표현하기 위해 만든 함수
export const toAmount =
  (context: CoinInformationContext, amount: string | number, coinType: string, tokenType?: string) => {
    const { precision } = tokenType ? context.tokens[coinType][tokenType] : context.coins[coinType]
    return toCurrency(amount, precision).toFixed()
  }

type AmountProps = {
  amount: string
  coinType: string
  contractAddress?: string
}

// TransactionDTO의 Object spread를 통해서 값을 간단하게 표현하기 위해 만든 컴포넌트
const Amount: React.FC<AmountProps> = ({ contractAddress, coinType, amount }) => {
  const { coins, tokens } = React.useContext(CoinContext)

  const { symbol, precision } = contractAddress ?
    tokens[coinType][contractAddress] : coins[coinType]

  const v = toCurrency(amount, precision)

  return (
    <>
      {v.toFixed()} {contractAddress ? symbol : coins[coinType].unit}
    </>
  )
}

type FeeProps = {
  unitPrice: string
  feeAmount: string
  coinType: string
}

const FeeMap: { [k: string]: { unit: string, cutting: number } } = {
  'ETH': { unit: 'GWEI', cutting: 9 },
  'ETHT': { unit: 'GWEI', cutting: 9 }
}

// 최소 단위로 되어있는 값을 가스 단위로 변환해주는 컴포넌트
const Fee: React.FC<FeeProps> = ({ coinType, unitPrice, feeAmount }) => {
  const { coins } = React.useContext(CoinContext)

  const { precision, unit, feeStrategy } = coins[coinType]
  const v = feeStrategy === 'ONLY_PRICE' ?
    toCurrency(feeAmount, precision) : toCurrency(unitPrice, precision - FeeMap[coinType].cutting)

  return (
    <>
      {v.toFixed()} {feeStrategy === 'ONLY_PRICE' ? unit : FeeMap[coinType].unit}
    </>
  )
}

export default {
  Fee, Amount
}
