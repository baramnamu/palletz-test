import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'

// import Application from './components/Application'
// import store, { history } from './store'
import session from './session'
import { ipcRenderer } from 'electron'
import { SMART_CARD_EVENT } from 'pzsc/dist/common'
// import EventEmitter from './store/eventEmitter'
// import { setVerbose } from './sc-client'
// import './i18n'

session.initSession()

const mainElement = document.createElement('div')
mainElement.setAttribute('class', 'palletz-app')
document.body.appendChild(mainElement)

