import { Component, Setup } from '@crui/core/dom';
import { result } from '@crui/core/dom/rendered';
import { DR$B } from '../rx/box/types';
import { swapNode } from './internals/swapNode';

export function $child<T, C, M>(
    stream: DR$B<T>,
    render: (item: T) => Component<C, M>
): Setup<C, M> {
    return (meta, dom, node, ctxt) => result(
        meta, 
        swapNode(
            stream,
            (item) => render(item)(dom, ctxt),
            (prev) => prev.lfc.unsub(),
            dom, node
        )
    )
}
