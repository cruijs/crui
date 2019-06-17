import { ws } from '@crui/core/combinators/combinator';
import { Component } from '@crui/core/dom';
import { K$S, P$S, with$Style } from '../elems/$style';

export function w$style<C, K extends K$S>(comp: Component<C>, style: P$S<K>) {
    return ws(comp, (dom, node) =>
        with$Style(dom, node, style)
    )
}