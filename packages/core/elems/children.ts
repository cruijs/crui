import { h } from './h';
import { Component, Setup, Tag, AnyTag } from '../dom';
import { defLifecycle, mergeLifecycles } from '../dom/rendered';

/**
 * An element with children
 */
export function hc<T extends Tag, C>(
    tag: T,
    setup: Setup<T, C>[],
    cs: Component<AnyTag, C>[]
): Component<T, C> {
    return h(tag, [...setup, children(cs)])
}

/**
 * Append children to a node
 */
export function children<C>(
    cs: Component<AnyTag, C>[]
): Setup<AnyTag, C> {
    return (dom, parent, ctxt) => {
        if (cs.length === 0) {
            return defLifecycle()
        }

        return mergeLifecycles(
            cs.map((render) => {
                const r = render(dom, ctxt)
                dom.insert(parent, r.node)
                return r.lfc
            })
        )
    }
}