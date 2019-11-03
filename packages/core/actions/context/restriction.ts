import { MatchRestr } from '../../types'

export type CtxtR<C> = {
    context: C
}

export type CtxtMR<C, A> =
    MatchRestr<CtxtR<C>, A>