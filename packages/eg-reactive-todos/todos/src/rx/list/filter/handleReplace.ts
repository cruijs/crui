import { Replace } from '..';
import { filteredList } from "./filteredList";
import { Index, Payload } from './types';

export function handleReplace<T>(upd: Replace<T>, { p, $nl }: Payload<T>): Index {
    const state = filteredList(upd.newList, p);
    $nl.replace(state.filtered);
    return state.indexMap;
}
