import {SessionAction} from './sessionActions'

export type RootActions = SessionAction[keyof SessionAction]
