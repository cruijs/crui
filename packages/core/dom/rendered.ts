import { AsyncFn, Node, Unsubscribe, Tag } from '../types'
import { combine, combineAsync, asyncBind } from '../utils/combine'
import { asyncNoop, noop } from '../utils/noop';
import { Modify, modify } from '../utils/modify'

export type Rendered<N extends Node<Tag> = Node<Tag>> = {
    readonly node: N
    readonly lfc: Lifecycle 
}

export type Lifecycle = {
    readonly unsub: Unsubscribe
    readonly onMounted: AsyncFn
    readonly onUnmount: AsyncFn
}

export function rendered<T extends Tag, N extends Node<T>>(node: N, lfc: Lifecycle): Rendered<N> {
    return { node, lfc }
}

export function defRendered<T extends Tag, N extends Node<T>>(node: N): Rendered<N> {
    return { node, lfc: defLifecycle() }
}

export function defLifecycle(): Lifecycle {
    return {
        unsub: noop,
        onMounted: asyncNoop,
        onUnmount: asyncNoop
    }
}

export function modLifecycle(f: Modify<Lifecycle>): Lifecycle {
    return modify(defLifecycle(), f)
}

type Collected = {
    unsub: Unsubscribe[],
    onMounted: AsyncFn[],
    onUnmount: AsyncFn[],
}
export function mergeLifecycles(ls: Lifecycle[]): Lifecycle {
    if (ls.length === 0) {
        return defLifecycle()
    }
    if (ls.length === 1) {
        return ls[0]
    }

    const collected = ls.reduce(
        (z, l) => {
            z.unsub.push(l.unsub)
            z.onMounted.push(l.onMounted)
            z.onUnmount.push(l.onUnmount)
            return z
        },
        { unsub: [], onMounted: [], onUnmount: [] } as Collected
    )
    return {
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