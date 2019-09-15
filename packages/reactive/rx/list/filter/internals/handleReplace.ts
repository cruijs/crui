import { opReplace } from '../../operations/factory';
import { Replace } from '../../types';
import { Payload } from '../types';
import { filteredList } from './filteredList';

export function handleReplace<T>(p: Payload<T>, upd: Replace<T>): Replace<T> {
    const { indexMap, filtered } = filteredList(upd.newList, 0, p.p);
    p.indexMap = indexMap
    return opReplace(p.$list.get(), filtered)
}
