import { FMap } from '../../box/map';
import { StreamBox } from '../../box/stream';
import { DR$B } from '../../box/types';
import { R$L } from '../types';

export function mapToBox<T, P>(list: R$L<T>, f: FMap<readonly T[], P>): DR$B<P> {
    const box = new StreamBox(f(list.get()))
    box.addUnsub(
        list.subscribe(() => {
            box.set(f(list.get()))
        })
    )

    return box
}