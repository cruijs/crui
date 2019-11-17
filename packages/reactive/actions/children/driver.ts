import { append, Append, bind, emptyNode, EmptyNode, Fn0, fragment, Fragment, insertAtRef, InsertAtRef, pipe, Remove, remove, then, waitAll } from '@crui/core';
import { Emitter } from '@crui/core/scheduler/emitter';
import { joinAll, Deferred } from '../../../core/utils/deferred/index'
import { Update, UpdateType } from '../../rx/list/types';
import { $ChildrenDriver, $ChildrenType } from './index';

type F<T> = (val: T) => void
function buffered<T>(f: F<T>): [F<T>, Fn0] {
    let acc: T[] = []
    let exec = (val: T) => { acc.push(val) }
    return [
        (val) => exec(val),
        () => {
            acc.forEach(f)
            acc = []
            exec = f
        }
    ]
}

type AReq<N> = Append<N>|Remove<N>|EmptyNode|Fragment<N>|InsertAtRef<N>
export const make$ChildrenDriver = <N>(): $ChildrenDriver<N, AReq<N>> => ({
    [$ChildrenType]: (parent, { stream }, { emit }) => {
        let unroll: Fn0
        return then(
            makeFragment(stream.get(), parent, emit, (zero) => {
                const b = buffered((upd: Update<N>) => {
                    runUpdate(parent, zero, emit, upd)
                })
                stream.subscribe(b[0])
                unroll = b[1]
            }),
            () => unroll()
        )
    }
})

function makeFragment<N>(
    list: readonly N[],
    parent: N,
    emit: Emitter<N, AReq<N>>['emit'],
    withZero: (zero: N) => void
): Deferred<N> {
    return bind(
        emit(parent, emptyNode),
        (zero) => {
            withZero(zero)

            return emit(parent, fragment([
                zero,
                ...list
            ]))
        }
    )
}

function runUpdate<N>(
    parent: N,
    zero: N,
    emit: Emitter<N, AReq<N>>['emit'],
    upd: Update<N>,
) {
    switch (upd.type) {
        case UpdateType.Update:
            pipe(
                emit(parent, remove(upd.oldValue)),
                () => emit(parent, insertAtRef(upd.newValue, zero, upd.index))
            )
            return

        case UpdateType.Replace:
            pipe(
                joinAll([
                    makeFragment(upd.newList, parent, emit, (z) => {
                        zero = z
                    }),
                    emitWaitAll(emit, parent, upd.oldList.map(remove)),
                ]),
                ([fragment]) => {
                    emit(parent, append(fragment))
                }
            )
            return

        case UpdateType.Splice:
            pipe(
                emitWaitAll(emit, parent, upd.removed.map(remove)),
                () => {
                    upd.added.forEach((n, i) => {
                        emit(parent, insertAtRef(n, zero, upd.index + i))
                    })
                }
            )
            return

        case UpdateType.Batch:
            upd.ops.forEach((op) => runUpdate(parent, zero, emit, op))
            return
    }

}

function emitWaitAll<N, A extends AReq<N>>(
    emit: Emitter<N, A>['emit'],
    node: N,
    actions: A[]
) {
    return waitAll(actions.map((a) =>
        emit(node, a)
    ))
}