import * as React from 'react'
import { Button, Popconfirm } from 'antd'
import { FoldContext } from './GuardRouter'
import { ButtonType } from 'antd/lib/button'

export type StepExtraButtonType = {
  label: string,
  onClick: () => void,
  disabled?: boolean
  ghost?: boolean
  type?: ButtonType
}

type Props = {
  nextText: string,
  cancelText?: string,
  disabled?: boolean
  onNext: () => void,
  onCancel?: () => void,
  confirmText?: string,
  loading?: boolean
  style?: React.CSSProperties,
  extra?: StepExtraButtonType[]
}

const StepButton: React.FC<Props> = (props) => {

  const { folded } = React.useContext(FoldContext)
  const margin = folded ? '80px' : '320px'

  const renderBtn = (
    label: string, cb: () => void, key: number, disabled?: boolean, ghost?: boolean, type?: ButtonType) => (
    <Button
      className="step-button"
      key={key}
      onClick={cb}
      style={{
        width: '300px', height: '40px'
      }}
      type={type || 'primary'}
      loading={props.loading}
      ghost={ghost}
      disabled={disabled}
    >
      {label}
    </Button>
  )

  return (
    <footer
      className="bottom-control"
      style={{
        left: margin,
        width: `calc(100% - ${margin})`,
        ...props.style
      }}
    >
      {props.cancelText && props.onCancel && (
        <div
          style={{
            position: 'absolute',
            left: 0
          }}
        >
          <Popconfirm
            onConfirm={props.onCancel}
            placement="top"
            okText={'Yes'}
            cancelText={'No'}
            title={'Are you sure want to restart the process'}
          >
            <Button
              className="step-button"
              style={{
                width: '300px', height: '40px', marginLeft: '2rem'
              }}
              type={'danger'}
              ghost={true}
            >
              {props.cancelText}
            </Button>
          </Popconfirm>
        </div>
      )}
      <div>
        {props.extra && props.extra.map((v, i) => (
          renderBtn(v.label, v.onClick, i, v.disabled, v.ghost, v.type)
        ))}
        {renderBtn(props.nextText, props.onNext, -1, props.disabled)}
      </div>
    </footer>
  )
}

export default StepButton
