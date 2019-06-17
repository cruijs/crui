import { DOM } from '@crui/core/dom';
import { Lifecycle, Rendered } from '@crui/core/dom/rendered';
import { noop } from '@crui/core/utils/noop';
import { DR$B } from '../../rx/box/types';
import { makeGuard } from '../../utils/guard';

export function swapNode<T, N>(
    stream: DR$B<T>,
    f: (item: T) => Rendered<N, any>,
    cleanup: (prev: Rendered<N, any>) => void,
    dom: DOM<N>,
    parent: N,
): Lifecycle {
    let cur = f(stream.get())
    let cancel = noop

    stream.subscribe((item) => {
        cancel()
        const g = makeGuard()
        cancel = g.cancel

        const prev = cur
        prev.lfc.onUnmount().then(g.guard(() => {
            cur = f(item)
            dom.replace(prev.node, cur.node)
            cleanup(prev)

            return cur.lfc.onMounted()
        }))
    })

    dom.insert(parent, cur.node)

    return {
        unsub: () => {
            stream.destroy()
            cur.lfc.unsub()
        },
        onMounted: () => cur.lfc.onMounted(),
        onUnmount: () => cur.lfc.onUnmount(),
    }
}