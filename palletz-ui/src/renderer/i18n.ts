import i18n, { TOptions } from 'i18next'
import { initReactI18next } from 'react-i18next'
import o from './messages'

const getLocaleResource = (locale: string) => {
  return Object.keys(o).reduce((r: any, k: string) => {
    r[k] = (o as { [k: string]: { [k: string]: string } })[k][locale]
    return r
  }, {})
}
const resources = {
  'en_US': {
    translation: getLocaleResource('en_US')
  },
  'ko_KR': {
    translation: getLocaleResource('ko_KR')
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en_US',
  debug: true,
  keySeparator: false,
  interpolation: {
    escapeValue: false
  }
})

export type ResourceKey = keyof typeof o

export const t = (k: ResourceKey, options?: TOptions<any> | string) => i18n.t(k, options)
export const i18nInstance = i18n
