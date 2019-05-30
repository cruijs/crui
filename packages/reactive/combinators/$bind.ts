import { Component } from '@crui/core/dom/index';
import { mergeRendered } from '@crui/core/elems/rendered';
import { Bind, with$Bind } from '../elems/$bind';
import { Stream } from '../rx/stream'

export function w$b<C>(comp: Component<C>, bind: Bind): Component<C> {
    return (dom, ctxt) => {
        const r = comp(dom, ctxt)

        return mergeRendered(r.node, [
            r,
            with$Bind(dom, r.node, bind)
        ])
    }
}

export function $bindVal<C>(comp: Component<C>, value: Stream<string>) {
    return w$b(comp, { value })
}

export function $bindCheck<C>(comp: Component<C>, checked: Stream<boolean>) {
    return w$b(comp, { checked })
}