import { AnyTag, Component } from '@crui/core/dom';
import { DR$B } from '../rx/box/types';
import { swapNode } from './utils/swapNode';

export function $child<I, C>(
    stream: DR$B<I>,
    render: (item: I) => Component<AnyTag, C>
): Component<'#swap', C> {
    return (dom, ctxt) => {
        return swapNode(dom, stream,
            (item) => render(item)(dom, ctxt),
            (prev) => prev.lfc.unsub()
        )
    }
}
