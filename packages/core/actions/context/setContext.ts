import { Action, Driver, ProvideDriver, RemoveRestr } from '../../types'
import { action } from '../action'
import { CtxtMR, CtxtR } from './restriction'
import { UseContextDriver } from './useContext'

export const SetContextType = Symbol('setContext')
export type SetContext<C, A extends Action> = Action<
    typeof SetContextType,
    DeriveD<C, A>,
    RemoveRestr<CtxtR<C>, A>,
    A['_return'],
    A['_kind']
> & {
    context: C
    wrapped: A
}

type DeriveD<C, A extends Action> =
    SetContextDriver<any, C, A>
    & ProvideDriver<UseContextDriver<any, C>, A>

export type SetContextDriver<N = any, C = any, A extends Action = any, S extends Action = never> = {
    [SetContextType]: Driver<N, SetContext<C, A>, A|S, A['_return']>
}

export function setContext<C, A extends Action>(context: C, wrapped: CtxtMR<C, A>): SetContext<C, A> {
    return action({
        type: SetContextType,
        context,
        wrapped,
    })
}