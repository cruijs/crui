import { Driver, InfraAction } from '../../types'
import { action } from '../action'

export const DestroyType = Symbol('destroy')
export type DestroyDriver<N = any> = {
    [DestroyType]: Driver<N, Destroy>
}
export type Destroy = InfraAction<typeof DestroyType, DestroyDriver>

export const destroy: Destroy = action({ type: DestroyType })