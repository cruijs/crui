import { Action, Driver, InfraAction } from '@crui/core'
import { action } from '@crui/core/actions/action'

export const RecalcDimType =
    Symbol('recalcDim')

export type RecalcDim =
    InfraAction<typeof RecalcDimType, RecalcDimDriver>

export type RecalcDimDriver<N = any, S extends Action = never> = {
    [RecalcDimType]: Driver<N, RecalcDim, S>
}

export const recalcDim: RecalcDim =
    action({ type: RecalcDimType })