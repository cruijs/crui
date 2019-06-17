import { AnyTag, Component } from '../dom';
import { rendered } from '../dom/rendered';
import { children } from './children';

export function fragment<C>(cs: Component<AnyTag, C>[]): Component<'#fragment', C> {
    return (dom, ctxt) => {
        const node = dom.createFragment()
        return rendered(node, children(cs)(dom, node, ctxt))
    }
}