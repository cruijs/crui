import { StreamList } from '../../stream';
import { DR$L, R$L, UpdateItem, UpdateType } from '../../types';
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
    let indexMap = state.indexMap

    const unsub = $source.subscribe((upd) => {
        const payload: Payload<T> = {
            indexMap, p, $list
        }
        switch (upd.type) {
            case UpdateType.Replace:
                indexMap = handleReplace(upd, payload)
                return
            case UpdateType.Update:
                indexMap = handleUpdate(upd, payload)
                return
            case UpdateType.Splice:
                indexMap = handleSplice(upd, payload)
                return
        }
    })
    $list.addUnsub(unsub)

    const refreshItem = (index: number) => {
        const payload: Payload<T> = {
            indexMap, p, $list
        }
        const val = $source.get()[index]
        const upd: UpdateItem<T> = {
            index,
            newValue: val,
            oldValue: val,
            type: UpdateType.Update,
        }
        indexMap = handleUpdate(upd, payload)
    }
    return { refreshItem, $list }
}