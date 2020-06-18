import * as React from 'react'
import { History } from 'history'
import { ConnectedRouter } from 'connected-react-router'

import session from '../session'

import './Application.scss'
// import GuardRouter from './GuardRouter'
import Api from '../api'
import EventEmitter from '../store/eventEmitter'
import { TOptions } from 'i18next'
import { ResourceKey, t } from '../i18n'
// import { StepContext } from '../pages/LaunchPageContext'

session.initSession()

interface AppProps {
  history: History
}

export const nlt = (k: ResourceKey, options?: TOptions<any> | string): React.ReactNode => {
  return t(k, options).split('\\n').map((line, i) => (<div key={i}>{line}</div>))
}

export const CoinContext = React.createContext<CoinInformationContext>({
  coins: {},
  tokens: {}
})

export default ({ history }: AppProps) => {
  const [coinInfo, setCoinInfo] = React.useState<CoinInformationContext>({
    coins: {},
    tokens: {}
  })
  const [step, setStep] = React.useState(0)
  const [started, setStarted] = React.useState(false)

  const setCoinContext = () => {
    Api.common.coinInfos().then(({ data: { coins, tokens } }) => {
      const info: CoinInformationContext = {
        coins:
          coins.reduce((acc: KvMap<CoinInformation>, val: CoinInformation) => {
            acc[val.symbol] = val
            return acc
          }, {}),
        tokens:
          tokens.reduce((acc: KvMap<KvMap<TokenInformation>>, val: TokenInformation) => {
            if (!acc[val.baseCoin]) {
              acc[val.baseCoin] = {}
            }

            acc[val.baseCoin][val.contractAddress] = val
            return acc
          }, {})
      }

      setCoinInfo(info)
      EventEmitter.dispatch('refresh-coin-context-done')
    })
  }

  React.useEffect(() => {
    const watcher = EventEmitter.subscribe('refresh-coin-context', setCoinContext)
    return () => watcher()
  }, [])

  return (
    <ConnectedRouter history={history}>
      <CoinContext.Provider value={coinInfo}>
        {/* {<StepContext.Provider value={{ step, setStep, started, setStarted }}>
          <GuardRouter/>
        </StepContext.Provider>} */}
      </CoinContext.Provider>
    </ConnectedRouter>
  )
}
