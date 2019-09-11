import { Replace, UpdateType } from '../../types';
import { Payload } from '../types';
import { filteredList } from './filteredList';

export function handleReplace<T>(p: Payload<T>, upd: Replace<T>): Replace<T> {
    const { indexMap, filtered } = filteredList(upd.newList, 0, p.p);
    p.indexMap = indexMap
    return {
        type: UpdateType.Replace,
        get oldList() {
            return p.$list.get()
        },
        newList: filtered
    }
}
