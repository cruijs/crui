import { DOM } from '@crui/core/dom';
import { Rendered } from '@crui/core/dom/rendered';
import { modify } from '@crui/core/utils/modify';
import { noop } from '@crui/core/utils/noop';
import { DR$B } from '../../rx/box/types';
import { makeGuard } from '../../utils/guard';

export function swapNode<T, N>(
    dom: DOM<N>,
    stream: DR$B<T>,
    f: (item: T) => Rendered<N>,
    cleanup: (prev: Rendered<N>) => void,
): Rendered<N> {
    let cur = f(stream.get())
    let cancel = noop

    const z: Rendered<N> = {
        node: cur.node,
        unsub: () => {
            stream.destroy()
            cur.unsub()
        },
        onMounted: () => cur.onMounted(),
        onUnmount: () => cur.onUnmount(),
    }

    stream.subscribe((item) => {
        cancel()
        const g = makeGuard()
        cancel = g.cancel

        const prev = cur
        prev.onUnmount().then(g.guard(() => {
            cur = f(item)
            dom.replace(prev.node, cur.node)
            cleanup(prev)

            modify(z, (m) => { m.node = cur.node })
            return cur.onMounted()
        }))
    })

    return z
}