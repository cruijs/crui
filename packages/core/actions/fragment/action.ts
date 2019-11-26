import { Action, InfraAction, Driver } from '../../types'
import { action } from '../action'

export const FragmentType = Symbol('fragment')
export type Fragment<N, F = N> = InfraAction<
    typeof FragmentType,
    FragmentDriver<N, F>,
    {},
    F
> & {
    children: N[]
}

export type FragmentDriver<N = any, F = any, S extends Action = never> = {
    [FragmentType]: Driver<N, Fragment<N, F>, S, F>
}

export function fragment<N, F = N>(children: N[]): Fragment<N, F> {
    return action({
        type: FragmentType,
        children,
    })
}