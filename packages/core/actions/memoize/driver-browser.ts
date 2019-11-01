import { AnyNodeAction } from '../../types'
import { Deferred } from '../../utils/deferred'
import { Memoize, MemoizeDriver, MemoizeType } from './index'

type Cache<E extends AnyNodeAction, N> =
    WeakMap<Memoize<E>, Deferred<N>>

export function makeMemoizeDriver<
    N = any,
    E extends AnyNodeAction = any
>(): MemoizeDriver<E, N> {
    const cache: Cache<E, N> = new WeakMap()

    return {
        [MemoizeType]: (_, action, { emit }) => {
            let node = cache.get(action)

            if (node === undefined) {
                node = emit(_, action.elem)
                cache.set(action, node)
            }
            
            return node
        }
    }
}