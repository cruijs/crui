import { Component, DOM, Tag } from '@crui/core/dom';
import { KProps } from '@crui/core/dom/props';
import { defRendered, mergeRendered, Rendered } from '@crui/core/dom/rendered';
import { withCSS } from '@crui/css-emotion/elems/css';
import { Config as Base, with$All as withBase } from '@crui/reactive/elems';
import { Interpolation } from 'emotion';
import { $CSS, with$CSS } from './$css';
import { DynCSS, with$DynCSS } from './dynCSS';

type Config<C, K extends KProps, $K extends KProps, M> = Base<C, K, $K> & {
    css?: Interpolation<M>
    $css?: $CSS<M>
    dynCss?: DynCSS
}
export function h$<C, K extends KProps, $K extends KProps, M>(
    tag: Tag, config: Config<C, K, $K, M>
): Component<C> {
    return (dom, ctxt) =>
        with$All(dom, ctxt, dom.create(tag), config)
}

type WithAll = <N, C, K extends KProps, $K extends KProps, M>(
    dom: DOM<N>,
    context: C,
    node: N,
    config?: Config<C, K, $K, M>,
) => Rendered<N>
export const with$All: WithAll = (dom, ctxt, node, config) => {
    if (config == null) {
        return defRendered(node)
    }
    withCSS(dom, node, config.css)
    return mergeRendered(node, [
        withBase(dom, ctxt, node, config),
        with$CSS(dom, node, config.$css),
        with$DynCSS(dom, node, config.dynCss),
    ])
}