import { Emitter } from '../../scheduler/emitter'
import { Drivers } from '../../types'
import { bind, constMap, Deferred, joinAll, waitAll } from '../../utils/deferred'
import { append, Append } from '../append'
import { CreateTag, createTag } from '../createTag'
import { Elem, ElemDriver, ElemType } from './index'

export const makeElemDriver = <N>(
): ElemDriver<N> => ({
    [ElemType]: driver
})

function driver<N, R, D extends Drivers>(
    parent: N,
    { tag, actions, children }: Elem<any, D, R>,
    { emit }: Emitter<N, Append<N> | CreateTag<N>>
): Deferred<N> {
    return bind(emit(parent, createTag(tag)), (node: N) => {
        const ds = actions.map((a) =>
            emit(node, a as any)
        )
        ds.push(bind(
            joinAll(children.map((c) =>
                emit(node, c as any)
            )),
            (children) => {
                return waitAll(children.map((a) => emit(node, append(a))))
            }
        ))

        return constMap(node, waitAll(ds))
    })
}