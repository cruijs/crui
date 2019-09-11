import { opBatch } from '../../operations/factory';
import { StreamList } from '../../stream';
import { DR$L, R$L, Update, UpdateType } from '../../types';
import { Payload, Predicate } from '../types';
import { filteredList } from './filteredList';
import { handleReplace } from './handleReplace';
import { handleSplice } from './handleSplice';
import { handleUpdate } from './handleUpdate';

type Result<T> = {
    $list: DR$L<T>
    refreshItem: (index: number) => void
}
export function setupFilter<T>($source: R$L<T>, p: Predicate<T>): Result<T> {
    const state = filteredList($source.get(), 0, p)
    const $list = new StreamList(state.filtered)
    const payload: Payload<T> = {
        p, $list, indexMap: state.indexMap
    }

    const unsub = $source.subscribe((upd) => {
        $list.apply(handle(payload, upd))
    })
    $list.addUnsub(unsub)

    const refreshItem = (index: number) => {
        const val = $source.get()[index]
        $list.apply(handle(payload, {
            index,
            newValue: val,
            oldValue: val,
            type: UpdateType.Update,
        }))
    }
    return { refreshItem, $list }
}

function handle<T>(payload: Payload<T>, upd: Update<T>): Update<T> {
    switch (upd.type) {
        case UpdateType.Replace:
            return handleReplace(payload, upd)

        case UpdateType.Update:
            return handleUpdate(payload, upd)

        case UpdateType.Splice:
            return handleSplice(payload, upd)
        
        case UpdateType.Batch:
            return opBatch(upd.ops.map(
                (u) => handle(payload, u)
            ))
    }
}