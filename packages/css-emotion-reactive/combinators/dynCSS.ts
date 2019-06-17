import { ws } from '@crui/core/combinators/combinator';
import { Component } from '@crui/core/dom';
import { DynCSS, with$DynCSS } from '../elems/dynCSS';

export function w$dss<C>(comp: Component<C>, styles: DynCSS): Component<C> {
    return ws(comp, (dom, node) =>
        with$DynCSS(dom, node, styles)
    )
}