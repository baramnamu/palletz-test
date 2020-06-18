import { action } from 'pzsc/dist/renderer'
import {
  Header,
  Metadata,
  PzscStatusCode,
  SC_GET_STATUS,
  SC_INIT_CARD,
  SC_READ_HEADER,
  SC_READ_JSON,
  SC_READ_META,
  SC_SET_VERBOSE,
  SC_VERIFY_PIN,
  SC_WRITE_JSON
} from 'pzsc/dist/common'
import { ipcRenderer } from 'electron'

type WRITE_TYPE = 'wallet/export' | 'tx/response'

export const writeJson = (payload: object[], type: WRITE_TYPE) =>
  action<void>(SC_WRITE_JSON, ipcRenderer, payload, type)

export const readJson = () => action<object[]>(SC_READ_JSON, ipcRenderer)

export const getStatus = () => action<PzscStatusCode>(SC_GET_STATUS, ipcRenderer)

export const verifyPin = (pin: number[]) => action<void>(SC_VERIFY_PIN, ipcRenderer, pin)

export const readMeta = () => action<Metadata>(SC_READ_META, ipcRenderer)

export const readHeader = () => action<Header>(SC_READ_HEADER, ipcRenderer)

export const setVerbose = () => action<void>(SC_SET_VERBOSE, ipcRenderer, true)

export const initCard = (
  changePin: number[],
  productId: string,
  productName: string,
  userId: string,
  userName: string,
  userLoginId: string,
  cardId: string) =>
  action<void>(
    SC_INIT_CARD, ipcRenderer,
    changePin, productId, productName, userId, userName, userLoginId, cardId
  )

export const pin = [0x36, 0x30, 0x34, 0x30, 0x30, 0x34, 0x39, 0x30]
