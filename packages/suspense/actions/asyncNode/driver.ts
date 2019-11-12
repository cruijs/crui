import { AnyNodeAction, bind, constMap, emptyNode, EmptyNode, Replace, replace, pipe, Deferred } from '@crui/core'
import { waitFor, WaitFor } from '../suspend/waitFor'
import { AsyncNodeDriver, AsyncNodeType } from './index'

export const makeAsyncNodeDriver = <
    N,
    T = any,
    E extends AnyNodeAction = any,
>(): AsyncNodeDriver<N, T, E, EmptyNode<N> | Replace<N> | WaitFor> => ({
    [AsyncNodeType]: (parent, { promise, make }, { emit }) => {
        const handlePromise = (stub: N) =>
            constMap(stub, emit(parent, waitForNode(stub)))

        const waitForNode = (stub: N) => waitFor(
            promise.then((value) => toPromise(bind(
                emit(parent, make(value)),
                (node) => emit(parent, replace(stub, node))
            )))
        )

        return bind(
            emit(parent, emptyNode),
            handlePromise
        )
    }
})

function toPromise<T>(def: Deferred<T>): PromiseLike<T> {
    return new Promise((resolve) => {
        pipe(def, resolve)
    })
}