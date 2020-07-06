import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { rootReducer, RootState } from '../reducers'
import { createHashHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'

export const history = createHashHistory()

/* store는 세션이나 지갑 정보처럼 거의 모든 페이지와 기능의 상태에 관계있는 정보를 저장한다. */
const configureStore = (initialState?: RootState) => {
  return createStore(
    rootReducer(history),
    initialState,
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history))
    )
  )
}

const store = configureStore()

if (typeof module.hot !== 'undefined') {
  module.hot.accept('../reducers', () => store.replaceReducer(rootReducer(history)))
}

export default store
