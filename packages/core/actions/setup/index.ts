import { Tag, TagMR } from '../../restrictions/tag'
import { AnySetupAction, CombineD, CombineR, Drivers } from '../../types'
import { Elem, hr } from '../elem/index'

export function setup<
    T extends Tag,
    A1 extends AnySetupAction,
    D extends Drivers,
    R
>(
    elem: Elem<T, D, R>,
    actions: readonly TagMR<A1, T>[]
): Elem<T, CombineD<D, A1>, CombineR<R, A1>> {
    return hr(elem.tag, [
        ...elem.actions,
        ...actions
    ], elem.children)
}