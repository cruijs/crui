import { Component, Setup } from '@crui/core/dom';
import { result } from '@crui/core/dom/rendered';
import { DR$B } from '../rx/box/types';
import { swapNode } from './internals/swapNode';

/**
 * Display a child based on Stream
 */
export function $child<T, C>(
    stream: DR$B<T>,
    render: (item: T) => Component<C>
): Setup<C> {
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
