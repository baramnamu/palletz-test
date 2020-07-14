import * as React from 'react'
import { Button, Form, Modal, Radio, Slider, Typography } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio'
import { SliderValue } from 'antd/lib/slider'
import { useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import Api from '../../api'
import { ResourceKey, t } from '../../i18n'
import LaunchTitle from './LaunchTitle'
import LaunchStepButton from './LaunchStepButton'
import { MnemonicContext, StepContext, VerifyContext } from '../LaunchPageContext'
import { EntropySizes } from '../../constants'
import { nlt } from '../../components/Application'
import PzIcon from '../../images/icons/PzIcon'

const { Text } = Typography

type Props = {
  title: ResourceKey
  subTitle: ResourceKey
}

const MIN_DISTRIBUTION = 2      // Maser key 분산 최소수
const MAX_DISTRIBUTION = 10     // Maser key 분산 최대수
const MARKS = Array(MAX_DISTRIBUTION - 1)
  .fill(MIN_DISTRIBUTION)
  .map((n, i) => n + i)
  .reduce((acc, val) => {
    acc[val] = `${val}`
    return acc
  }, {})

const MasterKeyForm = (props: Props) => {
  const { info, setInfo } = React.useContext(MnemonicContext)
  const { entropySize, needCount, totalCount } = info

  const [alertVisible, setAlertVisible] = React.useState(true)

  const onRadioChange = (e: RadioChangeEvent) => {
    setInfo({
      ...info,
      entropySize: EntropySizes[e.target.value]
    })
  }

  const onNeedCountChange = (value: SliderValue) => {
    setInfo({
      ...info,
      needCount: totalCount < value ? needCount : value as number
    })
  }

  const onTotalCountChange = (value: SliderValue) => {
    setInfo({
      ...info,
      needCount: needCount > value ? value as number : needCount,
      totalCount: value as number
    })
  }

  const dispatch = useDispatch()
  const { step, setStep } = React.useContext(StepContext)
  const { verify, setVerify } = React.useContext(VerifyContext)
  const { sequence } = verify

  const onSubmit = (setLoading: (l: boolean) => void) => {
    const masterKeyInformation = {
      needCount,
      totalCount,
      entropySize: entropySize[0]
    }

    setLoading(true)

    /* 실제 니모닉 검증은 Table.tsx에서 이루어진다.  */
    if (sequence === 'new') {
      Api.crypto.mnemonic.newWallet
        .generate(masterKeyInformation)
        .then(e => {
          setVerify({
            ...verify,
            code: e.data.verificationCode
          })
          setStep(step + 1)
          setLoading(false)
          dispatch(replace('/launch/wallet-setting/new/mnemonic-check'))
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      Api.crypto.mnemonic.restoration
        .prepare(masterKeyInformation)
        .then(() => {
          setStep(step + 1)
          setLoading(false)
          dispatch(replace('/launch/wallet-setting/restoration/mnemonic-confirm'))
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }

  return (
    <>
      <Modal
        visible={alertVisible}
        footer={null}
        title={null}
        centered={true}
        closable={false}
        width={850}
        style={{ textAlign: 'center' }}
        className="mnemonic-alert-modal"
      >
        <div className="align-item-center mnemonic-alert-caution">
          <PzIcon type="Info"/> <span className="ml-1">Caution</span>
        </div>
        <Text className="mnemonic-alert-content">
          {nlt('setup.ws.MnemonicCheck.Extra')}
        </Text>
        <div className="align-item-center" style={{ justifyContent: 'center', marginTop: '2rem' }}>
          <Button type="primary" size="large" onClick={() => setAlertVisible(false)}>
            {t('Common.Btn.Confirm')}
          </Button>
        </div>
      </Modal>
      <LaunchTitle main={props.title} sub={props.subTitle}/>
      <Form
        layout="vertical"
      >
        <Form.Item
          style={{
            textAlign: 'center'
          }}
        >
          <Radio.Group
            defaultValue={entropySize[0]}
            onChange={onRadioChange}
            size="large"
            buttonStyle="solid"
            value={entropySize[0]}
          >
            {Object.values(EntropySizes).reverse().map((e, i) => (
              <Radio.Button key={i} value={e[0]}>
                {e[0]} Entropy - {e[1]} Mnemonic
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Total count">
          <Slider
            marks={MARKS}
            min={MIN_DISTRIBUTION}
            max={MAX_DISTRIBUTION}
            value={totalCount}
            onChange={onTotalCountChange}
          />
        </Form.Item>
        <Form.Item label="Need count">
          <Slider
            marks={MARKS}
            min={MIN_DISTRIBUTION}
            max={MAX_DISTRIBUTION}
            value={needCount}
            onChange={onNeedCountChange}
          />
        </Form.Item>
      </Form>
      <LaunchStepButton onSubmit={onSubmit}/>
    </>
  )
}

export default MasterKeyForm
