import { Component, DOM } from '../dom';
import { Tag } from '../dom/index';
import { AsyncFn, Unsubscribe } from '../type';
import { combine, combineAsync } from '../utils/combine';
import { defRendered, Rendered } from './rendered';

export function hc<C>(tag: Tag, children?: Component<C>[]): Component<C> {
    return (dom, ctxt) => {
        const node = dom.create(tag)
        return withChildren(dom, ctxt, node, children)
    }
}
export function withChildren<N, C>(
    dom: DOM<N>,
    ctxt: C,
    parent: N,
    children?: Component<C>[]
): Rendered<N> {
    if (!children || children.length === 0) {
        return defRendered(parent)
    }

    return mergeRendered(
        parent,
        children.map((render) => {
            const r = render(dom, ctxt)
            dom.insert(parent, r.node)
            return r
        })
    )
}

type Collected = {
    unsub: Unsubscribe[],
    onMounted: AsyncFn[],
    onUnmount: AsyncFn[],
}
function mergeRendered<N>(p: N, rs: Rendered<N>[]): Rendered<N> {
    const collected = rs.reduce(
        (z, r) => {
            z.unsub.push(r.unsub)
            z.onMounted.push(r.onMounted)
            z.onUnmount.push(r.onUnmount)
            return z
        },
        {
            unsub: [],
            onMounted: [],
            onUnmount: [],
        } as Collected
    )
    return {
        node: p,
        unsub: combine(collected.unsub),
        onMounted: combineAsync(collected.onMounted),
        onUnmount: combineAsync(collected.onUnmount),
    }
}