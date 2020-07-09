import * as React from 'react'
import { Button, Input, message, Modal } from 'antd'
import MnemonicInput, { mnemonicWords } from './MnemonicInput'
import Api from '../../../api'
import LaunchStepButton from '../LaunchStepButton'
import { t } from '../../../i18n'
import { MnemonicContext, VerifyContext } from '../../LaunchPageContext'
import { EntropySizes } from '../../../constants'
import { VerifyStep } from './Check'
import SimpleModal from '../SimpleModal'

type Props = {}

type RefType = {
  word: string,
  setWord: (s: string) => void
}

/* package.json -> scripts 영역에 MNEMONIC_BYPASS=1 로 환경 변수 설정이 셋팅되어 있는 스크립트(보통 개발 모드로 포함)를 실행하면 아래 니모닉이 자동으로 입력된다.
   아래 니모닉을 통해 생성되는 지갑들을 메인넷에서 쓸 수는 있지만 실제 코인이 없어서 송금 테스트 등에 그대로는 쓸 수가 없다.
   TODO: 실제 비트코인이 들어있는 회사 공식 테스트 지갑을 생성하기 위한 니모닉은 사내 보안 정책상 소스에 그대로는 포함할 수가 없는데 향후 암호화하여 아래 words 부분을 교체하자.
 */
const words = [
  [
    "across", "deal", "mean", "bag", "midnight", "caught", "brick", "artist", "grunt", "debate", "border", "explain", "mass", "castle", "book", "this", "all", "drip", "like", "speed", "heavy", "glide", "book", "smoke", "silent", "decrease", "old", "smart", "goose", "drum", "broken", "sugar", "either", "crane", "crack", "extra", "major", "lock", "borrow", "speed", "choose", "couple", "light", "evoke", "major", "logic", "original", "armed", "treat"
  ],
  [
    "affair", "during", "mutual", "evoke", "little", "category", "borrow", "sugar", "mask", "economy", "present", "era", "heavy", "affair", "oblige", "baby", "maid", "crowd", "canyon", "eternal", "hammer", "catch", "october", "smoke", "play", "early", "meadow", "spend", "good", "drum", "pave", "this", "choice", "edge", "banana", "atom", "hedgehog", "fat", "breeze", "steak", "green", "deer", "another", "eyebrow", "hold", "during", "castle", "second", "lecture"
  ]
]


const mnemonicSize = Object.values(EntropySizes).reduce((acc: { [key: number]: number }, val) => {
  acc[val[1] - 4] = val[0]
  return acc
}, {})

const Table: React.FC<Props> = (props) => {
  const [mnemonic, setMnemonic] = React.useState<string[]>([])
  const [invalidAlert, setInvalidAlert] = React.useState(false)
  const [mnemonicAlert, setMnemonicAlert] = React.useState(false)

  const { info } = React.useContext(MnemonicContext)
  const { verify, setVerify } = React.useContext(VerifyContext)

  const { entropySize, totalCount, needCount } = info
  const { code, verifyStep, currentStep, sequence } = verify

  const refs = Array(entropySize[1]).fill(null).map(() => React.useRef<RefType>({
    word: '',
    setWord: () => {
    }
  }))

  // 니모닉 테이블에서 '128 Entropy', '192 Entropy', '256 Entropy' 를 삽입 현재 상태가 그려야되는지 확인
  const placeholderMap = Object.values(EntropySizes).map(v => v[1] - 4)

  React.useEffect(() => {
    if (sequence === 'new') {
      Api.crypto.mnemonic.newWallet
        .show({
          verifyStep,
          verificationCode: code
        })
        .then(({ data: { mnemonicWords } }) => {
          setMnemonic(mnemonicWords)
          if (sequence === 'new' && currentStep === VerifyStep.VERIFY && process.env.MNEMONIC_BYPASS === '1') {
            console.log(mnemonicWords)
            for (const i in mnemonicWords) {
              refs[i].current.setWord(mnemonicWords[i])
            }
            message.success('Mnemonic successfully bypassed!')
          }
        })
    }
  }, [])

  React.useEffect(() => {
    if (sequence === 'restoration' && process.env.MNEMONIC_BYPASS === '1') {
      for (const i in words[verifyStep]) {
        refs[i].current.setWord(words[verifyStep][i])
      }
      message.success('Mnemonic successfully bypassed!')
    }
  }, [])

  const mnemonicViewer = (i: number) => {
    return (
      <Input
        key={`input${i}`}
        value={mnemonic.length >= i ? mnemonic[i] : ''}
        className={'mnemonic-input'}
        prefix={<span className="launch-mnemonic-prefix">{i + 1}</span>}
        contentEditable={false}
      />
    )
  }

  /**
   * 니모닉 입력용 Input 박스인 <MnemonicInput> 컴포넌트를 리턴한다. 
   * <MnemonicInput> 컴포넌트는 자동 완성 기능용으로 trie-prefix-tree를 사용하여 앞 글자 검색 기능이 구현되어 있다.
   * @param i <MnemonicInput>의 인덱스 번호로 셋팅하기 위해 prop에 전달
   */
  const mnemonicVerifier = (i: number) => {
    return (
      <MnemonicInput
        key={`input${i}`}
        index={i}
        prefix={<span className="launch-mnemonic-prefix">{i + 1}</span>}
        ref={refs[i]}
      />
    )
  }

  /**
   * entropySize를 고려하여 니모닉 입력용 Input 박스 테이블을 셋팅한다.
   * @param generator 바로 위의 mnemonicVerifier를 전달받아서 니모닉 입력용 Input를 생성한다.
   */
  const getFields = (generator: (i: number) => React.ReactNode) => {
    const children = []

    const inputs = []
    for (let i = 0; i < entropySize[1]; i += 1) {
      inputs.push(
        <div key={`row${i}`} className="launch-mnemonic-row">
          {generator(i)}
        </div>
      )
    }

    for (let i = 0; i < entropySize[1]; i += 5) {
      let inner
      if (placeholderMap.includes(i)) {
        inner = inputs.slice(i, i + 4)
        inner.push(
          <div className="launch-mnemonic-row" key={`mnemonic${i}`}>
            <div className="launch-mnemonic-placeholder">
              {mnemonicSize[i]} Entropy
            </div>
          </div>
        )
        i -= 1
      } else {
        inner = inputs.slice(i, i + 5)
      }
      children.push(
        <div key={`col${i}`} className="launch-mnemonic-col">
          {inner}
        </div>
      )
    }
    return children
  }

  const onSubmit = () => {
    const mnemonic = refs.map(ref => ref.current.word.trim())
    if (sequence === 'new') {
      Api.crypto.mnemonic.newWallet
        .verify({
          mnemonic,
          step: verifyStep
        })
        .then(({ data: { notMatchedWords } }) => {
          if (notMatchedWords.length === 0) {
            const nextVerifyStep = verifyStep + 1
            if (nextVerifyStep === totalCount) {
              setVerify({
                ...verify,
                currentStep: VerifyStep.FINISH,
                verifyStep: nextVerifyStep
              })
            } else {
              setVerify({
                ...verify,
                currentStep: VerifyStep.CHECK1,
                verifyStep: nextVerifyStep
              })
            }
          } else {
            setInvalidAlert(true)
          }
        })
    } else {
      Api.crypto.mnemonic.restoration
        .confirm({
          verifyStep,
          mnemonicWords: mnemonic
        })
        .then(({ data: { success } }) => {
          const nextVerifyStep = verifyStep + 1
          if (success) {
            if (nextVerifyStep === needCount) {
              setVerify({
                ...verify,
                currentStep: VerifyStep.CHECK2,
                verifyStep: nextVerifyStep
              })
            } else {
              setVerify({
                ...verify,
                currentStep: VerifyStep.CHECK1,
                verifyStep: nextVerifyStep
              })
            }
          } else {
            setInvalidAlert(true)
          }
        })
    }
  }

  const mnemonicModal = () => {
    return (
      <Modal
        centered={true}
        closable={false}
        title={null}
        footer={null}
        visible={mnemonicAlert}
        className="mnemonic-wrong-alert-modal"
        width={1200}
      >
        <div className="mnemonic-wrong-alert-title">{t('setup.ws.Verify.Alert.Recheck')}</div>
        <div className="mnemonic-wrong-alert-content">
          {getFields(mnemonicViewer)}
        </div>
        <div className="mnemonic-wrong-alert-footer">
          <Button type="primary" onClick={() => setMnemonicAlert(false)}>
            {t('Common.Btn.Confirm')}
          </Button>
        </div>
      </Modal>
    )
  }

  const renderNew = () => {
    return <>
      {currentStep === VerifyStep.SHOW && getFields(mnemonicViewer)}
      {currentStep === VerifyStep.VERIFY && getFields(mnemonicVerifier)}
      {currentStep === VerifyStep.VERIFY && <LaunchStepButton onSubmit={onSubmit}/>}
      {currentStep === VerifyStep.VERIFY && (
        <SimpleModal
          visible={invalidAlert}
          setVisible={setInvalidAlert}
          title={'setup.ws.Verify.Alert.Title'}
          content={'setup.ws.Verify.Alert.Subtitle'}
          extra={[{
            label: 'setup.ws.Verify.Alert.Btn.View',
            onClick: () => setMnemonicAlert(true)
          }]}
        />
      )}
      {currentStep === VerifyStep.VERIFY && mnemonicModal()}
    </>
  }

  const renderRestoration = () => {
    return <>
      {currentStep === VerifyStep.SHOW && getFields(mnemonicVerifier)}
      {currentStep === VerifyStep.SHOW && <LaunchStepButton onSubmit={onSubmit}/>}
      {currentStep === VerifyStep.SHOW && (
        <SimpleModal
          visible={invalidAlert}
          setVisible={setInvalidAlert}
          title={'setup.ws.MnemonicCheck.Alert.Title'}
          content={'setup.ws.MnemonicCheck.Alert.Subtitle'}
        />
      )}
    </>
  }

  return (
    <div className="launch-mnemonic-table launch-flex-column">
      {sequence === 'new' ? renderNew() : renderRestoration()}
    </div>
  )
}

export default Table
