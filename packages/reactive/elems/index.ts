import { Component, DOM, Tag } from '@crui/core/dom';
import { KProps } from '@crui/core/dom/props';
import { mergeRendered, Rendered } from '@crui/core/dom/rendered';
import { Config as Base, withAll } from '@crui/core/elems';
import { Unsubscribe } from '@crui/core/type';
import { combine } from '@crui/core/utils/combine';
import { modify } from '@crui/core/utils/modify';
import { defRendered } from '../../core/dom/rendered';
import { $Checked, $Value, BCTag, BVTag, with$BindCheck, with$BindVal } from './$bind'
import { $Props, with$Props } from './$props';

export { BCTag, BVTag } from './$bind'

export type Config<C, P extends KProps, $P extends KProps> = Base<P, C> & {
    $props?: $Props<$P>
    unsub?: Unsubscribe,
}
export type WithBindVal = {
    $bindVal?: $Value,
}
export type WithBindCheck = {
    $bindCheck?: $Checked,
}
export type ConfigF<C, P extends KProps, $P extends KProps> = 
    Config<C, P, $P>
    & WithBindVal
    & WithBindCheck

export function h$<C, K extends KProps, $K extends KProps>(
    tag: BVTag, config: Config<C, K, $K> & WithBindVal
): Component<C>
export function h$<C, K extends KProps, $K extends KProps>(
    tag: BCTag, config: Config<C, K, $K> & WithBindCheck
): Component<C>
export function h$<C, K extends KProps, $K extends KProps>(
    tag: Tag, config: Config<C, K, $K>
): Component<C>
export function h$<C, K extends KProps, $K extends KProps>(
    tag: Tag, config: ConfigF<C, K, $K>
): Component<C> {
    return (dom, ctxt) =>
        with$All(dom, ctxt, dom.create(tag), config)
}

type WithAll = <N, C, K extends KProps, $K extends KProps>(
    dom: DOM<N>,
    context: C,
    node: N,
    config?: ConfigF<C, K, $K>,
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