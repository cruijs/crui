import { UpdateType } from '@crui/reactive/rx/list';
import { afterAll, pipe } from '../../deferred';
import { Emitter } from '../../emitter';
import { Append, append } from '../append';
import { InsertAt, insertAt } from '../insertAt';
import { Remove, remove } from '../remove';
import { $ChildrenDriver, $ChildrenType } from './index';

type AReq<N> = Append<N>|Remove<N>|InsertAt<N>
export const $childrenDriver: $ChildrenDriver<any, AReq<any>> = {
    [$ChildrenType]: (parent, { stream }, { emit }) => {
        stream.forEach((n) => {
            emit(parent, append(n))
        })

        stream.subscribe((upd) => {
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
            }
        })

        return parent
    }
}

function emitAllAsync<N, A extends AReq<N>>(
    emit: Emitter<N, A>['emit'],
    node: N,
    actions: A[]
) {
    return afterAll(actions.map((a) =>
        emit(node, a)
    ))
}