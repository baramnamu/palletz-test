import axios from 'axios'

export default {
  getSessionKey() {
    return localStorage.getItem('sessionKey')
  },
  clearSession() {
    localStorage.removeItem('sessionKey')
    delete axios.defaults.headers.common['Authorization']
  },
  saveSession(data: any) {
    localStorage.setItem('sessionKey', data.sessionKey)
    axios.defaults.headers.common['Authorization'] = data.sessionKey
  },
  initSession() {
    const sessionKey = localStorage.getItem('sessionKey')
    if (!sessionKey) this.clearSession()
    else axios.defaults.headers.common['Authorization'] = sessionKey
  }
}
