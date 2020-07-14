import * as React from 'react'
import { History } from 'history'
import { ConnectedRouter } from 'connected-react-router'

import session from '../session'

import './Application.scss'
import GuardRouter from './GuardRouter'
import Api from '../api'
import EventEmitter from '../store/eventEmitter'
import { TOptions } from 'i18next'
import { ResourceKey, t } from '../i18n'
import { StepContext } from '../pages/LaunchPageContext'

session.initSession()

interface AppProps {
  history: History
}

/* ReactNode 는 ReactElement | null 와 같다. 즉 HTML 노드(엘리먼트) 타입임을 말한다. */
export const nlt = (k: ResourceKey, options?: TOptions<any> | string): React.ReactNode => {
  return t(k, options).split('\\n').map((line, i) => (<div key={i}>{line}</div>))
}

/* 일반적인 React 애플리케이션에서 데이터는 위에서 아래로 (즉, 부모로부터 자식에게) props를 통해 전달되지만, 
   애플리케이션 안의 여러 컴포넌트들에 전해줘야 하는 props의 경우 (예를 들면 선호 로케일, UI 테마) 이 과정이 번거로울 수 있습니다. 
   context를 이용하면, 트리 단계마다 명시적으로 props를 넘겨주지 않아도 많은 컴포넌트가 이러한 값을 공유하도록 할 수 있습니다. 
   참조> https://ko.reactjs.org/docs/context.html */
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

  /* setCoinContext()는 백엔드 서버에서 코인/토큰 정보를 받아서 TS객체로 포장한다. */
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
  }, [])    /* 두 번째 인수로 넘긴 빈 배열([])의 의미는 "clean-up(메모리 해제) 과정을 마운트와 마운트 해제 시에 딱 한 번씩만 실행"한다는 의미이다.
               만약 state 변수가 배열 속에 들어 있으면 "clean-up 과정을 state변수가 바뀌는 경우 = 렌더링 시 마다 실행"한다.
               참조> https://ko.reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects */

  return (
    <ConnectedRouter history={history}>
      <CoinContext.Provider value={coinInfo}>
        {<StepContext.Provider value={{ step, setStep, started, setStarted }}>
          <GuardRouter/>
        </StepContext.Provider>}
      </CoinContext.Provider>
    </ConnectedRouter>
  )
}
