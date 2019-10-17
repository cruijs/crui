import { UpdateType } from '@crui/reactive/rx/list';
import { then } from '../../deferred';
import { Emitter } from '../../emitter';
import { Append, append } from '../append/index';
import { InsertAt, insertAt } from '../insertAt';
import { Remove, remove } from '../remove';
import { $ChildrenDriver, $ChildrenType } from './index';

type AReq<N> = Append<N>|Remove<N>|InsertAt<N>
export const $childrenDriver: $ChildrenDriver<any, AReq<any>> = {
    [$ChildrenType]: (parent, { stream }, { emit, emitAll }) => {
        stream.forEach((n) => {
            emit(parent, append(n))
        })

        stream.subscribe((upd) => {
            switch (upd.type) {
                case UpdateType.Update:
                    then(
                        emit(parent, remove(upd.oldValue)),
                        () => { 
                            emit(parent, insertAt(upd.newValue, upd.index))
                        }
                    )
                    return

                case UpdateType.Replace:
                    then(
                        emitAll(parent, upd.oldList.map(remove)),
                        () => { 
                            upd.newList.forEach((n) => {
                                emit(parent, append(n))
                            }) 
                        }
                    )
                    return
                
                case UpdateType.Splice:
                    then(
                        emitAll(parent, upd.removed.map(remove)),
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
): void {
    actions.forEach((a) => {
        emit(node, a)
    })
}