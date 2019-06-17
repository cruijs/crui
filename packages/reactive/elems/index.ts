import { Component, DOM, Tag } from '@crui/core/dom';
import { KProps } from '@crui/core/dom/props';
import { mergeRendered, Rendered } from '@crui/core/dom/rendered';
import { Config as Base, withAll } from '@crui/core/elems';
import { Unsubscribe } from '@crui/core/type';
import { combine } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';
import { defRendered } from '../../core/dom/rendered';
import { $Checked, $Value, BCTag, BVTag, with$BindCheck, with$BindVal } from './$bind';
import { $Props, with$Props } from './$props';
import { K$S, P$S } from './$style';

export { BCTag, BVTag } from './$bind';

export type Config<C, P extends KProps, $P extends KProps, $S extends K$S> = Base<P, C> & {
    $props?: $Props<$P>
    $style?: P$S<$S>
    unsub?: Unsubscribe,
}
export type WithBindVal = {
    $bindVal?: $Value,
}
export type WithBindCheck = {
    $bindCheck?: $Checked,
}
export type ConfigF<C, P extends KProps, $P extends KProps, $S extends K$S> = 
    Config<C, P, $P, $S>
    & WithBindVal
    & WithBindCheck

export function h$<C, K extends KProps, $K extends KProps, $S extends K$S>(
    tag: BVTag, config: Config<C, K, $K, $S> & WithBindVal
): Component<C>
export function h$<C, K extends KProps, $K extends KProps, $S extends K$S>(
    tag: BCTag, config: Config<C, K, $K, $S> & WithBindCheck
): Component<C>
export function h$<C, K extends KProps, $K extends KProps, $S extends K$S>(
    tag: Tag, config: Config<C, K, $K, $S>
): Component<C>
export function h$<C, K extends KProps, $K extends KProps, $S extends K$S>(
    tag: Tag, config: ConfigF<C, K, $K, $S>
): Component<C> {
    return (dom, ctxt) =>
        with$All(dom, ctxt, dom.create(tag), config)
}

type WithAll = <N, C, K extends KProps, $K extends KProps, $S extends K$S>(
    dom: DOM<N>,
    context: C,
    node: N,
    config?: ConfigF<C, K, $K, $S>,
) => Rendered<N>
export const with$All: WithAll = (dom, ctxt, node, config) =>
    (config == null)
        ? defRendered(node)
        : withUnsub(config.unsub, mergeRendered(node, [
            withAll(dom, ctxt, node, config),
            with$Props(dom, node, config.$props),
            with$BindVal(config.$bindVal)(dom, node),
            with$BindCheck(config.$bindCheck)(dom, node),
        ]))

const withUnsub = <N>(unsub: Unsubscribe | undefined, r: Rendered<N>) => (
    unsub
        ? modify(r, (m) => {
            m.unsub = combine([r.unsub, unsub])
        })
        : r
)