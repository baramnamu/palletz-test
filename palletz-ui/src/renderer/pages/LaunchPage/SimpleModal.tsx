import * as React from 'react'
import { Button, Modal, Typography } from 'antd'
import PzIcon from '../../images/icons/PzIcon'
import { nlt } from '../../components/Application'
import { ResourceKey, t } from '../../i18n'

type Props = {
  visible: boolean
  setVisible: (visible: boolean) => void
  title: ResourceKey
  content: ResourceKey
  extra?: {
    label: ResourceKey,
    onClick: () => void
  }[]
  onClick?: () => void
}

const { Text } = Typography

const SimpleModal: React.FC<Props> = ({ visible, setVisible, title, content, extra, onClick }) => {
  return (
    <Modal
      centered={true}
      visible={visible}
      closable={false}
      footer={null}
      title={null}
      className="mnemonic-simple-modal"
    >
      <div className="align-item-center mnemonic-alert-caution">
        <PzIcon type="Info"/> <span className="ml-1">{t(title)}</span>
      </div>
      <Text className="mnemonic-alert-content">
        {nlt(content)}
      </Text>
      <div className="align-item-center" style={{ justifyContent: 'center' }}>
        {extra && extra.map((e, i) => (
          <Button onClick={e.onClick} key={i} style={{ marginRight: '0.5rem' }}>
            {t(e.label)}
          </Button>
        ))}
        <Button type="primary" onClick={onClick || (() => setVisible(false))}>
          {t('Common.Btn.Confirm')}
        </Button>
      </div>
    </Modal>
  )
}

export default SimpleModal
