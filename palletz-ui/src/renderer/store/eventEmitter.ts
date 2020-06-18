/**
 //component 간에 props 로 전달할 필요 없이 이벤트 키를 통해 액션 호출할 수 있음. 가벼운 redux.

 // 코드 예제
 import EventEmitter from "../../store/eventEmitter"

 const RELOAD_WHITELIST_ACTION = 'RELOAD_WHITELIST_ACTION';
 ....

 //이벤트 등록
 React.useEffect(() => {
    EventEmitter.subscribe(RELOAD_WHITELIST_ACTION, () => reload())   // RELOAD_WHITELIST_ACTION 키로 이벤트 등록
    return () => EventEmitter.unsubscribeTopic(RELOAD_WHITELIST_ACTION)                        // 다른페이지로 이동시 이벤트 정리!!
  }, [])

 //이벤트 호출
 EventEmitter.dispatch(RELOAD_WHITELIST_ACTION, { value : 1, page: 0, .... })   //RELOAD_WHITELIST_ACTION 로 등록된 이벤트 호출

 */



const EventEmitter:{
  events:{[key:string]: Function[] | undefined},
  dispatch:(e:string, data?:any) => void,
  subscribe:(e:string, cb:Function) => () => void,
  unsubscribeTopic: (event: string) => void,
  unsubscribeAll:() => void
} = {
  events : {},
  dispatch(event: string, data: {} = {}) {
    console.log('EventEmitter::', event, data)
    if( !this.events[event] ) return

    this.events[event]!.forEach((callback: Function) => callback(data))
  },
  subscribe(event: string, callback: Function) {
    if (!this.events[event]) this.events[event] = []
    console.log('EventEmitter::subscribe', event)
    this.events[event]!.push(callback)
    return () => {
      this.events[event] = this.events[event]!.filter(v => v !== callback)
    }
  },
  unsubscribeTopic(event: string) {
    delete this.events[event]
  },
  unsubscribeAll() {
    this.events = {}
  }
}

export default EventEmitter
