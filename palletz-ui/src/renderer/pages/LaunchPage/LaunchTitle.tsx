import * as React from 'react'
import { Popover, Typography } from 'antd'
import { ResourceKey, t } from '../../i18n'
import PzIcon from '../../images/icons/PzIcon'

const { Title, Text } = Typography

export type LaunchTitleProps = {
  main: ResourceKey,
  sub: ResourceKey,
  style?: React.CSSProperties
}
1
const LaunchTitle: React.FC<LaunchTitleProps> = (props) => {
  return (
    <div className="launch-title" style={props.style}>
      <Title
        level={3}
      >
        {t(props.main)}
      </Title>
      <Text style={{ fontSize: '16px' }}>
        {t(props.sub)}
      </Text>
    </div>
  )
}

export default LaunchTitle
