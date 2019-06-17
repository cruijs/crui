import { Component } from '../dom';

/**
 * Extract information from Context and use them to build a Component.
 */
export function useContext<C, D, M extends {}>(
    f: (ctxt: C) => Component<D, M>
): Component<C & D, M> {
    return (dom, ctxt) => f(ctxt)(dom, ctxt)
}

/**
 * Alter Context for a given Component tree
 */
export function withContext<C, D, M extends {}>(
    f: (ctxt: C) => D,
    comp: Component<D, M>
): Component<C, M> {
    return (dom, ctxt) => comp(dom, f(ctxt))
}