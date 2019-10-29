import { Driver, SetupAction } from '../../types'
import { action } from '../action'

export const DestroyType = Symbol('destroy')
export type DestroyDriver<N = any> = {
    [DestroyType]: Driver<N, Destroy>
}
export type Destroy = SetupAction<typeof DestroyType, DestroyDriver>

export const destroy: Destroy = action({ type: DestroyType })