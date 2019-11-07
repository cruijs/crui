import { action } from '../../actions/action'
import { Action, Driver } from '../../types'

export const ExtractType = Symbol('extract')
export type ExtractRet<A extends Action> = Action<
    typeof ExtractType,
    ExtractDriver & A['_drivers'],
    A['_restriction'],
    A['_return'],
    A['_kind']
> & {
    wrapped: A
}

export type ExtractDriver<N = any, A extends Action = any, S extends Action = never> = {
    [ExtractType]: Driver<N, ExtractRet<A>, A|S>
}

export function extract<A extends Action>(wrapped: A): ExtractRet<A> {
    return action({
        type: ExtractType,
        wrapped,
    })
}