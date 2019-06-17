import { Component, Tag } from '../dom';

/**
 * Extract information from Context and use them to build a Component.
 */
export function useContext<C, D, T extends Tag>(
    f: (ctxt: C) => Component<T, D>
): Component<T, C & D> {
    return (dom, ctxt) => f(ctxt)(dom, ctxt)
}

/**
 * Alter Context for a given Component tree
 */
export function withContext<C, D, T extends Tag>(
    f: (ctxt: C) => D,
    comp: Component<T, D>
): Component<T, C> {
    return (dom, ctxt) => comp(dom, f(ctxt))
}