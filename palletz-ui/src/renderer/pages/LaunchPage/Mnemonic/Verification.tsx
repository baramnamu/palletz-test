import * as React from 'react'
import { Button, Form, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import api from '../../../api'
import MnemonicInput from './MnemonicInput'
import Title from 'antd/lib/typography/Title'

type Status = 'success' | 'warning' | 'error'

interface Props extends FormComponentProps {
  onValidate: (valid: boolean) => void
  step: number
  count: number
}

const Verification: React.FC<Props> = (props: Props) => {
  const ids = Array(props.count).fill(0).map((e, i) => `Mnemonic ${i + 1}`)
  const [vs, setVS] = React.useState(Array(props.count).fill(''))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mnemonicObj = props.form.getFieldsValue(ids)
    const mnemonic: string[] = []
    for (const id of ids) {
      const word = mnemonicObj[id]
      if (word.length === 0) {
        // TODO
        return
      }
      mnemonic.push(word)
    }
    api.crypto.mnemonic.newWallet
      .verify({
        mnemonic,
        step: props.step - 1
      })
      .then(({data: { notMatchedWords }}) => {
        if (notMatchedWords.length === 0) {
          props.onValidate(true)
        } else {
          setVS(Array(props.count).fill('success'))
          props.onValidate(false)
          const invalid: number[] = [...notMatchedWords]
          const newVs = [...vs]
          for (const i of invalid) {
            newVs[i] = 'error'
          }
          setVS(newVs)
        }
      })
      .catch(e => {
        console.log(e)
        props.onValidate(false)
      })
  }

  const onValidate = (status: 'success' | 'warning' | 'error', index: number) => {
    const newVs = [...vs]
    newVs[index] = status
    setVS(newVs)
  }

  const getFields = () => {
    const children = []
    const { getFieldDecorator } = props.form
    for (let i = 0; i < props.count; i += 1) {
      children.push(
        <Col span={8} key={`col${i}`}>
          <Form.Item
            label={`Mnemonic #${i + 1}`}
            key={`item${i}`}
            hasFeedback={true}
            validateStatus={vs[i]}
            style={{
              padding: '1rem'
            }}
          >
            {
              getFieldDecorator(ids[i], {
                initialValue: { word: '' },
                rules: [
                  { required: true },
                ]
              })(<MnemonicInput key={ids[i]} index={i} onValidate={onValidate} />)
            }
          </Form.Item>
        </Col>
      )
    }
    return children
  }

  return (
    <>
      <Title>{`Master key backup sequence #${props.step}`}</Title>
      <Form>
        <Row gutter={24}>{getFields()}</Row>
        <Row>
          <Col
            span={4}
            offset={20}
            style={{
              marginTop: '15px',
              textAlign: 'right'
            }}
          >
            <Button type="primary" onClick={onSubmit}>Verify</Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default Form.create<Props>({})(Verification)
