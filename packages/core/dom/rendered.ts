import { AsyncFn, Unsubscribe } from '../types';
import { asyncBind, combine, combineAsync } from '../utils/combine';
import { Modify, modify } from '../utils/modify';
import { asyncNoop, noop } from '../utils/noop';

export type Rendered<N, M> = {
    readonly node: N
    readonly meta: M
    readonly lfc: Lifecycle 
}

export type Meta<T> = { tag: T }

export type SetupR<M> = {
    lfc: Lifecycle,
    meta: M
}

export type Lifecycle = {
    readonly unsub: Unsubscribe
    readonly onMounted: AsyncFn
    readonly onUnmount: AsyncFn
}

export function rendered<N, M>(node: N, lfc: Lifecycle, meta: M): Rendered<N, M> {
    return { node, lfc, meta }
}

export function defRendered<N, M>(node: N, meta: M): Rendered<N, M> {
    return { node, lfc: defLifecycle(), meta }
}

export function defResult<M>(meta: M): SetupR<M> {
    return {
        meta,
        lfc: defLifecycle()
    }
}

export function result<M>(meta: M, lfc: Lifecycle): SetupR<M> {
    return { meta, lfc }
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

export function modifyLfc<N, M>(r: Rendered<N, M>, f: Modify<Lifecycle>): Rendered<N, M> {
    return modify(r, (m) => {
        m.lfc = modify(m.lfc, f)
    })
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