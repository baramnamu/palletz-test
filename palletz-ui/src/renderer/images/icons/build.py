import os
import shutil
import re

template = """import * as React from 'react'
{:s}
import {{ Icon }} from 'antd'

const iconMap: KvMap<any> = {{
{:s}
}}

type Props = {{
  type: string,
  className?: string,
  width?: number,
  height?: number,
  viewBox?: string,
  onClick?: () => void,
  style?: React.CSSProperties
}}

const PzIcon: React.FC<Props> = (props) => {{
  const CustomIcon = iconMap[props.type]

  if (props.width) {{
    return (
      <Icon
        onClick={{props.onClick}}
        style={{props.style}}
        component={{() =>
          <CustomIcon
            className={{props.className}}
            width={{props.width}}
            height={{props.height}}
            viewBox={{props.viewBox}}
          />
        }}
      />
    )
  }}

  return (
    <Icon
      onClick={{props.onClick}}
      style={{props.style}}
      component={{() =>
        <CustomIcon
          className={{props.className}}
          viewBox={{props.viewBox}}
        />
      }}
    />
  )
}}

export default PzIcon"""

klass = """import * as React from 'react'
export default () =>
{:s}"""

s = []
imp = []

for svg in os.listdir():
  if not svg.endswith('svg'):
   continue
  file = svg.split('.')[0]
  imp.append("import {:s} from './{:s}.svg'".format(file, file))
  s.append("  '{:s}': (props: any) => <{:s} {{...props}}/>,".format(file, file))

with open('PzIcon.tsx', 'w') as f:
    f.write(template.format('\n'.join(imp), '\n'.join(s)))
