import { Component } from '@crui/core/dom';
import { DR$B } from '../rx/box/types';
import { swapNode } from './internals/swapNode';

export function $child<T, C>(
    stream: DR$B<T>,
    render: (item: T) => Component<C>
): Component<C> {
    return (dom, ctxt) => {
        return swapNode(dom, stream,
            (item) => render(item)(dom, ctxt),
            (prev) => prev.lfc.unsub()
        )
    }
}
