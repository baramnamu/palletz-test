import i18n, { TOptions } from 'i18next'
import { initReactI18next } from 'react-i18next'
import o from './messages'

const getLocaleResource = (locale: string) => {
  /* messages 파일의 구조가 ResourceKey1: { 'ko_KR': ~ , 'en_US': ~ }, ResourceKey2: { 'ko_KR': ~ , 'en_US': ~ }, ... , ResourceKeyN : { 'ko_KR': ~ , 'en_US': ~ } 
     형태({ [k: string]: { [k: string]: string } })로 되어 있는데 특정 언어 하나에 대해서만 모아서 ResourceKey1: ~, ResourceKey2: ~, ... ,ResourceKeyN : ~   */
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
/* 언어변경은 i18nInstance.changeLanguage('ko_KR') 로 가능하다.*/
