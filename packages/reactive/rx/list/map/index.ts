import { StreamList, Update, UpdateType } from '..';

export function $map<A, B>(
    $parent: StreamList<A>, 
    f: (a: A) => B
) {
    const $list = new StreamList($parent.map(f))
    const unsub = $parent.subscribe(makeSubscribe(f, $list))
    return { unsub, $list }
}

export function makeSubscribe<A, B>(
    map: (a: A) => B,
    $children: StreamList<B>
) {
    return (upd: Update<A>) => {
        switch (upd.type) {
            case UpdateType.Update:
                $children.update(
                    upd.index,
                    map(upd.newValue)
                )
                break

            case UpdateType.Replace:
                $children.set(
                    upd.newList.map(map)
                )
                break

            case UpdateType.Splice:
                $children.splice(
                    upd.index,
                    upd.removed.length,
                    upd.added.map(map)
                )
                break
        }
    }
}