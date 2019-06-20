import { Component } from '../dom';

/**
 * Extract information from Context and use them to build a Component.
 */
export function useContext<C, D>(
    f: (ctxt: C) => Component<D>
): Component<C & D> {
    return (dom, ctxt) => f(ctxt)(dom, ctxt)
}

/**
 * Alter Context for a given Component tree
 */
export function withContext<C, D>(
    f: (ctxt: C) => D,
    comp: Component<D>
): Component<C> {
    return (dom, ctxt) => comp(dom, f(ctxt))
}