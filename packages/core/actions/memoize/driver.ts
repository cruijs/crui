import { AnyNodeAction } from '../../types'
import { Deferred } from '../../utils/deferred'
import { MemoizeDriver, MemoizeType } from './index'

type Cache<E extends AnyNodeAction, N> =
    WeakMap<E, Deferred<N>>

export function makeMemoizeDriver<
    N = any,
    E extends AnyNodeAction = any
>(): MemoizeDriver<N, E> {
    const cache: Cache<E, N> = new WeakMap()

    return {
        [MemoizeType]: (_, { elem }, { emit }) => {
            let node = cache.get(elem)

            if (node === undefined) {
                node = emit(_, elem)
                cache.set(elem, node)
            }
            
            return node
        }
    }
}