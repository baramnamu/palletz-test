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

/* 비동기 방식으로 외부 실행 파일을 실행시키기 위한 Promise 객체 */
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
  /* GuardRouter.tsx 에서 ipcRenderer.send('hsm-check')로 이벤트를 발생시킬 것이다. */
  ipcMain.on('hsm-check',  async () => {
    if (!isWin || skip) {
      console.warn('Unsupported platform. Slot manager not works.')
      setTimeout(() => {
        webContent && webContent.send('hsm-checked', null)  // GuardRouter.tsx에서 ipcRenderer.on('hsm-checked', ...)으로 이벤트 리스너를 열어두고 있다.
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

  /* HSM Slot 수가 3개 이상인 장비로 납품하도록 합의되었다. 만약 변동 사항이 생기면 아래 if 조건을 수정할 것.*/
  if (list.length < 3) {
    throw new Error('Invalid HSM Slot number')
  }
}

export default registerHSMHandler
