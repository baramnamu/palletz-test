import { platform } from 'process'
import { execFile } from 'child_process'
import { resolve } from 'path'
import { WebContents, ipcMain } from 'electron'

const isWin = platform.startsWith('win')
const HSM = resolve(__dirname, 'slotmanager.exe')
console.log(HSM)

type ExecResult = {
  stdout: string[]
  stderr: string
}

const promiseExecFile = (file: string, option: string[]): Promise<ExecResult> => {
  console.log(file)
  return new Promise<ExecResult>((resolve, reject) => {
    execFile(file, option, ((error: any, stdout, stderr) => {
      if (error) {
        console.log('error ==>', error)
        return reject(error.code || -1)
      }

      return resolve({ stderr, stdout: stdout.trimRight().split('\r\n') })
    }))
  })
}

const registerHSMHandler = (webContent?: WebContents, skip?: boolean) => {
  ipcMain.on('hsm-check',  async () => {
    if (!isWin || skip) {
      console.warn('Unsupported platform. Slot manager not works.')
      setTimeout(() => {
        webContent && webContent.send('hsm-checked', null)
      }, 500)
      return
    }

    try {
      await checkHSMList()
    } catch (e) {
      webContent && webContent.send('hsm-checked', e)
      return
    }

    webContent && webContent.send('hsm-checked', null)
  })
}

export const checkHSMList = async () => {
  let list

  try {
    const { stdout } = await promiseExecFile(HSM, ['list'])
    console.log(stdout)
    list = stdout
  } catch (e) {
    throw e
  }

  if (list.length < 3) {
    throw new Error('Invalid HSM Slot number')
  }
}

export default registerHSMHandler
