import { DOM } from '@crui/core/dom';
import { Rendered } from '@crui/core/dom/rendered';
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
        get node() { return cur.node },
        meta: {},
        lfc: {
            unsub: () => {
                stream.destroy()
                cur.lfc.unsub()
            },
            onMounted: () => cur.lfc.onMounted(),
            onUnmount: () => cur.lfc.onUnmount(),
        }
    }

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

    return z
}