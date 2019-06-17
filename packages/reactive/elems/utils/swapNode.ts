import { DOM, Node } from '@crui/core/dom';
import { Rendered } from '@crui/core/dom/rendered';
import { noop } from '@crui/core/utils/noop';
import { DR$B } from '../../rx/box/types';
import { makeGuard } from '../../utils/guard';

export function swapNode<I, M extends Node<string>, N extends Node<'#swap'>>(
    dom: DOM<M>,
    stream: DR$B<I>,
    f: (item: I) => Rendered<M>,
    cleanup: (prev: Rendered<M>) => void,
): Rendered<N> {
    let cur = f(stream.get())
    let cancel = noop

    const z: Rendered<N> = {
        get node() { return cur.node as any },
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