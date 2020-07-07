import * as React from 'react'
import LaunchTitle from '../LaunchTitle'
import { Form, Icon, Input, message, Progress } from 'antd'
import LaunchStepButton from '../LaunchStepButton'
import { getDiskList } from '../../../cd-client'
import Api from '../../../api'
import { Finger } from '../../../finger-client'
import { ResourceKey, t } from '../../../i18n'
import { AdminContext, StepContext } from '../../LaunchPageContext'
import { LaunchStepMapping } from '../LaunchSteps'
import { useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'

const BackupTitleSequence: {
  main: ResourceKey
  sub: ResourceKey
}[] = [{
  main: 'setup.ws.Restore.Start.Title',
  sub: 'setup.ws.Restore.Start.Subtitle'
}, {
  main: 'setup.ws.Restore.Processing.Title',
  sub: 'setup.ws.Restore.Processing.Subtitle'
}, {
  main: 'setup.ws.Restore.Complete.Title',
  sub: 'setup.ws.Restore.Complete.Subtitle'
}]

const BackupSequence = () => {
  const [percent, setPercent] = React.useState(0)
  const [restoreStep, setRestoreStep] = React.useState(0)
  const [isWorking, setWorking] = React.useState(false)
  const [word, setWord] = React.useState('')

  const { admin } = React.useContext(AdminContext)
  const { setStep } = React.useContext(StepContext)
  const dispatch = useDispatch()

  const onSubmit = () => {
    if (!isWorking && restoreStep === 0) {
      setRestoreStep(1)
      setWorking(true)
    }

    if (!isWorking && restoreStep === 2) {
      setStep(LaunchStepMapping.length - 1)
      dispatch(replace('/login'))
    }
  }

  React.useEffect(() => {
    console.log("called", isWorking)
    if (isWorking) {
      (async function restore() {
        const diskList = await getDiskList()

        if (!diskList || diskList.length === 0) {
          message.error('Check CD driver')
          return
        }
        setPercent(10)

        const { path } = diskList[0].volume[0]
        const datPath = (await Api.systemAdmin.migration.copyDumpFile(path)).data
        setPercent(20)

        try {
          await Finger.dataRestore(word, datPath)
        } catch (e) {
          console.log(e)
          message.error('Invalid PIN')
          throw new Error('Invalid PIN')
        }
        setPercent(40)

        const uuid = (await Api.systemAdmin.migration.extractDumpFile()).data
        setPercent(50)

        for (const v of uuid) {
          await Finger.restore(v.split('.')[0].substr(0, 36), word)
        }
        setPercent(70)

        const { loginId, newPassword } = admin.system
        await Api.systemAdmin.migration.restore(loginId, newPassword)
        setPercent(100)
        setRestoreStep(2)
        setWorking(false)
      })()
        .catch(() => {
          message.error('Fail to restore')
          setPercent(0)
          setRestoreStep(0)
          setWorking(false)
        })
    }
  }, [isWorking])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value)
  }

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      onSubmit()
    }
  }

  return (
    <>
      <LaunchTitle {...BackupTitleSequence[restoreStep]}/>
      <div className="flex-center-center launch-backup-sequence">
        <Progress
          type="circle"
          percent={percent}
          format={
            p => (
              <img
                src={require('../../../images/backup.png')}
                alt=""
                style={{
                  width: '4rem',
                  height: '4rem'
                }}
              />
            )}
          width={200}
        />
        <Form.Item>
          <Input
            value={word}
            type="password"
            prefix={<Icon type="lock" />}
            placeholder={t('sm.migration.backup.alert.SetPIN.placeholder')}
            onChange={onChange}
            onKeyUp={onKeyUp}
          />
        </Form.Item>
      </div>
      <LaunchStepButton onSubmit={onSubmit} disabled={isWorking || word.length !== 4}/>
    </>
  )
}

export default BackupSequence
