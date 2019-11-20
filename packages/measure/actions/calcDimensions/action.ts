import { Action, InfraAction, Driver } from '@crui/core'
import { action } from '@crui/core/actions/action'

export type BoundingRect = {
    top: number,
    bottom: number,
    left: number,
    right: number,
    width: number,
    height: number,
}

export const CalcDimensionsType = Symbol('calcDimensions')
export type CalcDimensions = InfraAction<
    typeof CalcDimensionsType,
    CalcDimensionsDriver,
    {},
    BoundingRect
>

export type CalcDimensionsDriver<N = any, S extends Action = never> = {
    [CalcDimensionsType]: Driver<N, CalcDimensions, S, BoundingRect>
}

export const calcDimensions: CalcDimensions = action({ type: CalcDimensionsType })