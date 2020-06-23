import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'

import Application from './components/Application'
import store, { history } from './store'
import session from './session'
import { ipcRenderer } from 'electron'
import { SMART_CARD_EVENT } from 'pzsc/dist/common'
import EventEmitter from './store/eventEmitter'
import { setVerbose } from './sc-client'
import './i18n'

session.initSession()

const mainElement = document.createElement('div')
mainElement.setAttribute('class', 'palletz-app')
document.body.appendChild(mainElement)

setVerbose()

ipcRenderer.on(SMART_CARD_EVENT, (event, args) => {
    EventEmitter.dispatch(SMART_CARD_EVENT, { s: args, isReset: false, isChecked: false })
    event.returnValue = true
})

const render = () => {
  return ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Application history={history}/>
      </Provider>
    </AppContainer>,
    mainElement
  )
}

render()

/* 아래 라인은 webpack.renderer.dev.config.js 파일의 devServer: { ... hot: true, ...} 설정으로 인하여 작동된다. 
   즉 개발중에 소스(모듈)가 수정되면 즉시 적용해준다. */
if (module.hot) {
  module.hot.accept('./app', () => render)
}
