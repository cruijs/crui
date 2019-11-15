import { StreamList } from '../stream';
import { DR$L, R$L } from '../types';

export function cloneRW<T>(list: R$L<T>): DR$L<T> {
    const cln = new StreamList(list.get().slice())
    cln.addUnsub(
        list.subscribe((op) => cln.apply(op))
    )
    return cln
}