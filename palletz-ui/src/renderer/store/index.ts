import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { rootReducer, RootState } from '../reducers'
import { createHashHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'

export const history = createHashHistory()

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
