import { StreamList } from '../stream';
import { DR$L, R$L, W$L, Update, UpdateType } from '../types';

type FMap<A, B> = (v: A, i: number) => B
export function $map<A, B>(
    $source: R$L<A>, 
    f: FMap<A, B>
): DR$L<B> {
    const $list = new StreamList($source.map(f))
    $list.addUnsub(
        $source.subscribe(onUpdate(f, $list))
    )
    return $list
}

export function onUpdate<A, B>(
    fmap: FMap<A, B>,
    $children: W$L<B>
) {
    return (upd: Update<A>) => {
        switch (upd.type) {
            case UpdateType.Update:
                $children.update(
                    upd.index,
                    fmap(upd.newValue, upd.index)
                )
                break

            case UpdateType.Replace:
                $children.set(
                    upd.newList.map(fmap)
                )
                break

            case UpdateType.Splice:
                $children.splice(
                    upd.index,
                    upd.removed.length,
                    upd.added.map((v, i) => fmap(v, i + upd.index))
                )
                break
        }
    }
}