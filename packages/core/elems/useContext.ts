import { Component } from '../dom/index';

export function useContext<C extends D, P, D>(
    f: (ctxt: C) => P,
    comp: (props: P) => Component<D>
): Component<C> {
    return (dom, ctxt) => comp(f(ctxt))(dom, ctxt)
}