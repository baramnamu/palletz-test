import { action, CD_BACKUP, CD_GET_DEVICE_LIST } from 'pzburn/dist/lib'
import { DeviceInfo } from 'pzburn-native'
import { ipcRenderer } from 'electron'

// fail flag only works in non-win platform
export const getDiskList = (fail?: boolean) => action<DeviceInfo[]>(CD_GET_DEVICE_LIST, ipcRenderer, fail)

export const diskBackup =
  (deviceIndex: number, filePath: string[]) => action<void>(CD_BACKUP, ipcRenderer, deviceIndex, filePath)
