import * as React from 'react'
import { Icon, Popover, Steps } from 'antd'
import '../../components/Application.scss'
import { StepContext } from '../LaunchPageContext'
import { t } from '../../i18n'

const { Step } = Steps

/* 시스템 초기화 Step 화면 출력 문구 */
const stepDescription = [
  {
    title: t('processbar.sa.all.title'),            // System Admin
    sub: [
      t('processbar.sa.all.firststep')
    ]
  },
  {
    title: t('processbar.ms.all.title'),            // Wallet Settings
    sub: [
      t('processbar.ms.cm.firststep'),
      t('processbar.ms.cm.secondstep'),
      t('processbar.ms.cm.thirdstep'),
      t('processbar.ms.cm.fourthstep')
    ]
  },
  {
    title: t('processbar.pa.all.title'),            // Policy Admin
    sub: [
      t('processbar.pa.all.firststep'),
      t('processbar.pa.all.secondstep')
    ]
  },
  {
    title: t('processbar.complete.all.title'),      // Complete
    sub: []
  }
]

/* 상단 Step Progress Bar 진행 지점 위치 저장용 배열 생성  */
export const LaunchStepMapping: number[] = stepDescription.reduce((acc: [number, number[]], val) => {
  for (let i = acc[0] + 1; i <= acc[0] + val.sub.length; i += 1) {
    acc[1].push(i)
  }

  acc[0] += val.sub.length + 1

  return acc    // 최종 acc 결과는 [11, [1,3,4,5,6,8,9]]
}, [0, []])[1]  // [1,3,4,5,6,8,9]

interface StepDotContext {
  index: number,
  status: 'process' | 'wait' | 'finish' | 'error'
  title: string,
  description?: string
}

const LaunchSteps: React.FC = () => {
  const stepContext = React.useContext(StepContext)

  let i = 0
  /* 아래 <Steps> 컴포넌트에 실제로 진행 dot를 삽입하는 함수 */
  const dot = (iconDot: React.ReactNode, context: StepDotContext) => {
    const { index, status, title, description } = context
    if (description) {
      return (
        <Popover placement='bottom' content={description} arrowPointAtCenter={true}>
          {iconDot}
        </Popover>
      )
    }

    i += 1
    return <div className="pz-steps-icon">{status === 'finish' ? <Icon type="check"/> : i}</div>    // 체크 표시나 step 숫자가 들어가는 큰 원형 아이콘
  }

  return (
    <div>
      {stepContext.step < LaunchStepMapping.length && (     // 현재 step이 전체 step수(LaunchStepMapping.length)보다 작으면 <Steps> 엘리먼트를 표시한다.
        <Steps
          progressDot={dot}
          className="pz-steps"
          current={LaunchStepMapping[stepContext.step]}         // current 값에 의해서 아래 <Step>의 status 값이 결정된다.
        >
          {stepDescription.map(e => {
            const co: React.ReactNode[] = []                        // const dot 함수의 iconDot 파라미터로 전달될 node들의 배열
            co.push(
              <Step title={e.title} className="main-step"/>         // <Step>의 index값이 <Steps>의 current값보다 작으면 'finish', 같으면 'process', 크면 'wait'이다.
            )
            co.push(
              ...e.sub.map((v, i, a) => {
                return (
                  <Step
                    key={`${v}-${i}`}
                    description={v}
                    className={i === a.length - 1 ? 'sub-main-step' : 'sub-step'}
                  />
                )
              })
            )
            return co
          })}
        </Steps>
      )}
    </div>
  )
}

export default LaunchSteps
