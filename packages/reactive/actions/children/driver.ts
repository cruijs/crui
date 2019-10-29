import { Append, append, InsertAt, insertAt, pipe, Remove, remove, waitAll } from '@crui/core';
import { Emitter } from '@crui/core/scheduler/emitter';
import { Update, UpdateType } from '../../rx/list/types';
import { $ChildrenDriver, $ChildrenType } from './index';

type AReq<N> = Append<N>|Remove<N>|InsertAt<N>
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
            pipe(
                emit(parent, remove(upd.oldValue)),
                () => {
                    emit(parent, insertAt(upd.newValue, upd.index))
                }
            )
            return

        case UpdateType.Replace:
            pipe(
                emitAllAsync(emit, parent, upd.oldList.map(remove)),
                () => {
                    upd.newList.forEach((n) => {
                        emit(parent, append(n))
                    })
                }
            )
            return

        case UpdateType.Splice:
            pipe(
                emitAllAsync(emit, parent, upd.removed.map(remove)),
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

function emitAllAsync<N, A extends AReq<N>>(
    emit: Emitter<N, A>['emit'],
    node: N,
    actions: A[]
) {
    return waitAll(actions.map((a) =>
        emit(node, a)
    ))
}