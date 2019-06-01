import { Component } from '../dom/index';

/**
 * Extract information from Context and use them to build a Component.
 */
export function useContext<C extends D, P, D>(
    f: (ctxt: C) => P,
    comp: (props: P) => Component<D>
): Component<C> {
    return (dom, ctxt) => comp(f(ctxt))(dom, ctxt)
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