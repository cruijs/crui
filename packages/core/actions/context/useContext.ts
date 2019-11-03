import { Action, Driver } from '../../types'
import { action } from '../action'
import { CtxtR } from './restriction'

type Make<C, A> = (context: C) => A

export const UseContextType = Symbol('useContext')
export type UseContext<C, A extends Action> = Action<
    typeof UseContextType,
    UseContextDriver<any, A> & A['_drivers'],
    CtxtR<C> & A['_restriction'],
    A['_return'],
    A['_kind']
> & {
    make: Make<C, A>
}

export type UseContextDriver<N = any, C = any, A extends Action = any, S extends Action = never> = {
    [UseContextType]: Driver<N, UseContext<C, A>, A|S, A['_return']>
}

export function useContext<C, A extends Action>(make: Make<C, A>): UseContext<C, A> {
    return action({
        type: UseContextType,
        make
    })
}