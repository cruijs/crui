import { AnyTag, Component } from '../dom';

/**
 * Extract information from Context and use them to build a Component.
 */
export function useContext<C, D, T extends AnyTag>(
    f: (ctxt: C) => Component<T, D>
): Component<T, C & D> {
    return (dom, ctxt) => f(ctxt)(dom, ctxt)
}

/**
 * Alter Context for a given Component tree
 */
export function withContext<C, D, T extends AnyTag>(
    f: (ctxt: C) => D,
    comp: Component<T, D>
): Component<T, C> {
    return (dom, ctxt) => comp(dom, f(ctxt))
}