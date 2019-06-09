import { Replace } from '../../types';
import { Index, Payload } from '../types';
import { filteredList } from './filteredList';

export function handleReplace<T>(upd: Replace<T>, { p, $list: $nl }: Payload<T>): Index {
    const state = filteredList(upd.newList, 0, p);
    $nl.set(state.filtered);
    return state.indexMap;
}
