import { Component } from '@crui/core/dom';
import { StreamBox } from '../rx/box';
import { swapNode } from './utils/swapNode';

export function $child<T, C>(
    stream: StreamBox<T>,
    render: (item: T) => Component<C>
): Component<C> {
    return (dom, ctxt) => {
        return swapNode(dom, stream,
            (item) => render(item)(dom, ctxt),
            (prev) => prev.unsub()
        )
    }
}
