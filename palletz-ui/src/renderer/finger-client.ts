import {
  action,
  FINGER_BACKUP,
  FINGER_CANCEL,
  FINGER_DATA_BACKUP,
  FINGER_DATA_RESTORE,
  FINGER_ENROLL,
  FINGER_GET_ENROLL_COUNT,
  FINGER_REMOVE,
  FINGER_RESTORE,
  FINGER_VERIFY
} from 'pzfinger/dist/lib'
import { ipcRenderer } from 'electron'

export const Finger = {
  remove: (uuid: string) => action<void>(FINGER_REMOVE, ipcRenderer, uuid),
  enroll: (uuid: string) => action<void>(FINGER_ENROLL, ipcRenderer, uuid),
  verify: (uuid: string) => action<{ result: boolean, retCode: number }>(FINGER_VERIFY, ipcRenderer, uuid),
  cancel: () => action<void>(FINGER_CANCEL, ipcRenderer),
  count: () => action<number>(FINGER_GET_ENROLL_COUNT, ipcRenderer),
  backup: (uuid: string, password: string) => action<void>(FINGER_BACKUP, ipcRenderer, uuid, password),
  restore: (uuid: string, password: string) => action<void>(FINGER_RESTORE, ipcRenderer, uuid, password),
  dataBackup: (password: string, filePath: string) =>
    action<void>(FINGER_DATA_BACKUP, ipcRenderer, password, filePath),
  dataRestore: (password: string, filePath: string) =>
    action<void>(FINGER_DATA_RESTORE, ipcRenderer, password, filePath)
}
