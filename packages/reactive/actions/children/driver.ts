import { Append, append, InsertAt, insertAt, pipe, Remove, remove, replace, Replace, waitAll } from '@crui/core';
import { Emitter } from '@crui/core/scheduler/emitter';
import { Update, UpdateType } from '../../rx/list/types';
import { $ChildrenDriver, $ChildrenType } from './index';

type AReq<N> = Append<N>|Remove<N>|Replace<N>|InsertAt<N>
export const make$ChildrenDriver = <N>(): $ChildrenDriver<N, AReq<N>> => ({
    [$ChildrenType]: (parent, { stream }, { emit }) => {
        stream.subscribe((upd) => {
            runUpdate(parent, emit, upd)
        })

        return waitAll(stream.map((n) =>
            emit(parent, append(n))
        ))
    }
})

function runUpdate<N>(
    parent: N,
    emit: Emitter<N, AReq<N>>['emit'],
    upd: Update<N>,
) {
    switch (upd.type) {
        case UpdateType.Update:
            emit(parent, replace(upd.oldValue, upd.newValue))
            return

        case UpdateType.Replace:
            pipe(
                emitWaitAll(emit, parent, upd.oldList.map(remove)),
                () => {
                    upd.newList.forEach((n) => {
                        emit(parent, append(n))
                    })
                }
            )
            return

        case UpdateType.Splice:
            pipe(
                emitWaitAll(emit, parent, upd.removed.map(remove)),
                () => {
                    upd.added.forEach((n, i) => {
                        emit(parent, insertAt(n, upd.index + i))
                    })
                }
            )
            return

        case UpdateType.Batch:
            upd.ops.forEach((op) => runUpdate(parent, emit, op))
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