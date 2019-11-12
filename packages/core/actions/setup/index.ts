import { Tag, TagMR } from '../../restrictions/tag'
import { AnyNodeAction, AnySetupAction } from '../../types'
import { Elem, hr } from '../elem/index'

export function setup<
    T extends Tag,
    A0 extends AnySetupAction,
    A1 extends AnySetupAction,
    C extends AnyNodeAction
>(
    elem: Elem<T, A0, C>,
    actions: readonly TagMR<A1, T>[]
) {
    return hr(elem.tag, [
        ...elem.actions,
        ...actions
    ], elem.children)
}