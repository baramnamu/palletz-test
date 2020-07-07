import * as React from 'react'
import { Button, Form } from 'antd'
import { FormComponentProps, FormProps } from 'antd/lib/form'
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form'
import { ResourceKey, t } from '../../i18n'

type Eq = {
  fieldName: string,
  alert: string
}

type Props = {
  buttonLabel: ResourceKey
  onSubmit: ({ form }: FormComponentProps) => Promise<void>
  fields: {
    id: string,
    label?: string,
    component: React.ReactNode
    options?: GetFieldDecoratorOptions,
    eq?: Eq
  }[]
  formProps?: FormProps
} & FormComponentProps
const FormWrapper: React.FC<Props> = (props: Props) => {

  const onSubmit = () => {
    props.onSubmit(props)
  }

  const eq = ({ fieldName, alert }: Eq) => {
    return (rule: any, value: any, callback: any) => {
      const { getFieldValue } = props.form
      if (value !== getFieldValue(fieldName)) {
        return callback(alert)
      }
      return callback()
    }
  }

  const getFields = () => {
    const { getFieldDecorator } = props.form
    return props.fields.map((f, i) => {
      return (
        <Form.Item key={`formWrapperField${i}`}>
          {getFieldDecorator(f.id, {
            ...f.options,
            rules: f.options ?
              [...(f.options.rules || []), ...(f.eq ? [{ required: true, validator: eq(f.eq) }] : [])] : []
          })(f.component)}
        </Form.Item>
      )
    })
  }

  const onKeyUpEnter = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.keyCode === 13) {
      onSubmit()
    }
  }

  return (
    <Form {...props.formProps} className="launch-form-wrapper" onKeyUp={onKeyUpEnter} >
      {getFields()}
      <Button type="primary" className="launch-form-wrapper-submit" onClick={onSubmit}>
        {t(props.buttonLabel)}
      </Button>
    </Form>
  )
}

export default Form.create<Props>({ name: 'formWrapper' })(FormWrapper)
