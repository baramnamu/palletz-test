import * as React from 'react'
import { useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import Table from './Table'
import LaunchStepButton from '../LaunchStepButton'
import LaunchTitle, { LaunchTitleProps } from '../LaunchTitle'
import {
  defaultMnemonicInformation,
  defaultVerifyInformation,
  MnemonicContext,
  StepContext,
  VerifyContext
} from '../../LaunchPageContext'
import Api from '../../../api'
import SimpleModal from '../SimpleModal'

type Props = {}

export enum VerifyStep {
  CHECK1,
  SHOW, // restoration ==> verify step
  CHECK2,
  VERIFY,
  FINISH
}

const Check: React.FC<Props> = (props) => {
  const { info } = React.useContext(MnemonicContext)
  const { verify, setVerify } = React.useContext(VerifyContext)
  const { entropySize, totalCount, needCount } = info
  const { verifyStep, sequence, currentStep } = verify
  const [title, setTitle] = React.useState<LaunchTitleProps>({
    main: 'setup.ws.MnemonicCheck.Title',
    sub: 'setup.ws.MnemonicCheck.Subtitle'
  })
  const [combineFail, setCombineFail] = React.useState(false)

  React.useEffect(() => {
    if (sequence === 'new') {
      switch (currentStep) {
        case VerifyStep.CHECK1:
        case VerifyStep.SHOW:
          setTitle({
            main: 'setup.ws.MnemonicCheck.Title',
            sub: 'setup.ws.MnemonicCheck.Subtitle'
          })
          break
        case VerifyStep.CHECK2:
          setTitle({
            main: 'setup.ws.VerifyCard.Title',
            sub: 'setup.ws.VerifyCard.Subtitle'
          })
          break
        case VerifyStep.VERIFY:
          setTitle({
            main: 'setup.ws.Verify.Title',
            sub: 'setup.ws.Verify.Subtitle'
          })
          break
        case VerifyStep.FINISH:
          setTitle({
            main: 'setup.ws.VerifyCardComplete.Title',
            sub: 'setup.ws.VerifyCardComplete.Subtitle'
          })
          break
      }
    } else {
      switch (currentStep) {
        case VerifyStep.CHECK1:
        case VerifyStep.SHOW:
          setTitle({
            main: 'setup.ws.MnemonicCheckInput.Title',
            sub: 'setup.ws.MnemonicCheckInput.Subtitle'
          })
          break
        case VerifyStep.CHECK2:
          setTitle({
            main: 'setup.ws.MnemonicCheckComplete.Title',
            sub: 'setup.ws.MnemonicCheckComplete.Subtitle'
          })
          break
      }
    }
  }, [currentStep])

  const checkCount = sequence === 'new' ? totalCount : needCount

  /* "엔트로피 - 니모닉 사이즈", "니모닉 갯수", Need Count of Total Count, "verify 단계 / check count" 등의 안내 정보 카드 */
  const mnemonicCard = (
    <div className="launch-mnemonic-wrapper">
      <div>
        <div className="launch-default-container launch-mnemonic-card fill">
          <span>Entropy - Mnemonic Size</span>
          <div>
            {entropySize[0]} Entropy - {entropySize[1]} Mnemonic
          </div>
        </div>
        <div className="launch-default-container launch-mnemonic-card">
          <span>Need Count of Total Count</span>
          <div className="launch-mnemonic-highlight">
            {needCount} of {totalCount}
          </div>
        </div>
      </div>
      <div>
        <div
          className="launch-default-container launch-mnemonic-card now-progress"
        >
          <span>Now Progress</span>
          <div className={`${verifyStep === checkCount ? ' launch-mnemonic-highlight' : ''}`}>
            {verifyStep} / {checkCount}
          </div>
        </div>
      </div>
    </div>
  )

  const dispatch = useDispatch()
  const { step, setStep } = React.useContext(StepContext)
  const { setInfo } = React.useContext(MnemonicContext)

  const onCombineFail = () => {
    setCombineFail(false)
    setStep(1)
    setVerify(defaultVerifyInformation)
    setInfo(defaultMnemonicInformation)
    dispatch(replace('/launch/wallet-setting/choose-process'))
  }

  const components = sequence === 'new' ?
    [mnemonicCard, <Table key='MNEMONIC_SHOW'/>, mnemonicCard, <Table key='MNEMONIC_VERIFY'/>, mnemonicCard] :
  [
    mnemonicCard,
    <Table key='MNEMONIC'/>,
    <>
      {mnemonicCard}
      <SimpleModal
        visible={combineFail}
        setVisible={setCombineFail}
        title={'setup.ws.MnemonicCheckFail.Alert.Title'}
        content={'setup.ws.MnemonicCheckFail.Alert.Subtitle'}
        onClick={onCombineFail}
      />
    </>
  ]

  const onSubmit = () => {
    if (sequence === 'new') {
      switch (currentStep) {
        case VerifyStep.CHECK1:
          setVerify({
            ...verify,
            currentStep: VerifyStep.SHOW
          })
          break
        case VerifyStep.SHOW:
          setVerify({
            ...verify,
            currentStep: VerifyStep.CHECK2
          })
          break
        case VerifyStep.CHECK2:
          setVerify({
            ...verify,
            currentStep: VerifyStep.VERIFY
          })
          break
        case VerifyStep.FINISH:
          setStep(step + 1)
          dispatch(replace('/launch/wallet-setting/backup'))
          break
      }
    } else {
      switch (currentStep) {
        case VerifyStep.CHECK1:
          setVerify({
            ...verify,
            currentStep: VerifyStep.SHOW
          })
          break
        case VerifyStep.CHECK2:
          Api.crypto.mnemonic.restoration
            .combine({})
            .then(({ data: { success, verificationCode } }) => {
              if (success) {
                setStep(step + 1)
                dispatch(replace('/launch/wallet-setting/backup'))
              } else {
                setCombineFail(true)
              }
            })
          break
      }
    }
  }

  const createButton = (): boolean => {
    if (sequence === 'new') {
      if (currentStep !== VerifyStep.VERIFY) {
        return true
      }
    } else {
      if (currentStep !== VerifyStep.SHOW) {
        return true
      }
    }

    return false
  }

  return (
    <>
      <LaunchTitle {...title}/>
      {components[currentStep]}
      {createButton() && <LaunchStepButton onSubmit={onSubmit}/>}
    </>
  )
}

export default Check
