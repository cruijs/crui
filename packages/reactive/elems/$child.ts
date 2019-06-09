import { Component } from '@crui/core/dom';
import { DR$ } from '../rx/types';
import { swapNode } from './utils/swapNode';

export function $child<T, C>(
    stream: DR$<T>,
    render: (item: T) => Component<C>
): Component<C> {
    return (dom, ctxt) => {
        return swapNode(dom, stream,
            (item) => render(item)(dom, ctxt),
            (prev) => prev.unsub()
        )
    }
}
