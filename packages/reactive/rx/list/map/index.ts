import { LazyStreamList } from '../lazy-stream';
import { DR$L, R$L, Update, UpdateType, W$L } from '../types';

export type FMap<A, B> = (v: A, i: number) => B
export function $map<A, B>(
    $source: R$L<A>, 
    f: FMap<A, B>
): DR$L<B> {
    const $list = new LazyStreamList($source.map(f))
    $list.addUnsub(
        $source.subscribe((upd) => {
            handle(f, $list, upd)
            $list.runNotify()
        })
    )
    return $list
}

function handle<A, B>(f: FMap<A, B>, $list: W$L<B>, upd: Update<A>): void {
    switch (upd.type) {
        case UpdateType.Update:
            $list.update(
                upd.index,
                f(upd.newValue, upd.index)
            )
            return

        case UpdateType.Replace:
            $list.set(
                upd.newList.map(f)
            )
            return

        case UpdateType.Splice:
            $list.splice(
                upd.index,
                upd.removed.length,
                upd.added.map((v, i) => f(v, i + upd.index))
            )
            return

        case UpdateType.Batch:
            upd.ops.forEach((upd) => handle(f, $list, upd))
            return
    }
}