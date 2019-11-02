import { Action, Driver, InfraAction } from '../../types'
import { action } from '../action'

export const MountedType = Symbol('mounted')
export type Mounted = InfraAction<
    typeof MountedType,
    MountedDriver
>

export type MountedDriver<N = any, S extends Action = never> = {
    [MountedType]: Driver<N, Mounted, S>
}

export const mounted: Mounted = action({
    type: MountedType,
})