import { StreamList } from '..';
import { Unsubscribe } from '../../stream';
import { UpdateType } from '../index';
import { filteredList } from './filteredList';
import { handleReplace } from './handleReplace';
import { handleSplice } from './handleSplice';
import { handleUpdate } from './handleUpdate';
import { Payload, Predicate } from './types';

type Result<T> = {
    unsub: Unsubscribe,
    list: StreamList<T>
}
export function $filter<T>($l: StreamList<T>, p: Predicate<T>): Result<T> {
    const state = filteredList($l.get(), p)
    const $nl = new StreamList(state.filtered)
    let indexMap = state.indexMap

    const unsub = $l.subscribe((upd) => {
        const payload: Payload<T> = {
            indexMap, p, $nl
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

    return { unsub, list: $nl }
}