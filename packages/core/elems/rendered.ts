import { AsyncFn, Node, Unsubscribe } from '../type'
import { combine, combineAsync, asyncBind } from '../utils/combine'
import { asyncNoop, noop } from '../utils/noop';
import { Modify, modify } from '../utils/modify'

export type Rendered<N extends Node = Node> = {
    readonly node: N,
    readonly unsub: Unsubscribe,
    readonly onMounted: AsyncFn,
    readonly onUnmount: AsyncFn,
}

export function defRendered<N>(node: N): Rendered<N> {
    return {
        node,
        unsub: noop,
        onMounted: asyncNoop,
        onUnmount: asyncNoop
    }
}

export function modRendered<N>(node: N, f: Modify<Rendered<N>>): Rendered<N> {
    return modify(defRendered(node), f)
}

type Collected = {
    unsub: Unsubscribe[],
    onMounted: AsyncFn[],
    onUnmount: AsyncFn[],
}
export function mergeRendered<N>(p: N, rs: Rendered<N>[]): Rendered<N> {
    if (rs.length === 0) {
        return defRendered(p)
    }
    if (rs.length === 1) {
        return rs[0]
    }

    const collected = rs.reduce(
        (z, r) => {
            z.unsub.push(r.unsub)
            z.onMounted.push(r.onMounted)
            z.onUnmount.push(r.onUnmount)
            return z
        },
        { unsub: [], onMounted: [], onUnmount: [] } as Collected
    )
    return {
        node: p,
        unsub: combine(collected.unsub),
        onMounted: combineAsync(collected.onMounted),
        onUnmount: combineAsync(collected.onUnmount),
    }
}

export function combineMount(parent: AsyncFn, children: AsyncFn) {
    return asyncBind(parent, children)
}
export function combineUnmount(parent: AsyncFn, children: AsyncFn) {
    return asyncBind(children, parent)
}