import { Component, Setup } from '@crui/core/dom';
import { result } from '@crui/core/dom/rendered';
import { R$L } from '../rx';
import { $map as l$map } from '../rx/list/map';
import { with$Children } from './internals/children';

/**
 * Children Stream Map
 * 
 * Map a stream of items T into children and add them in the element
 */
export function c$map<T, C>(
    $list: R$L<T>,
    item: (i: T) => Component<C>
): Setup<C> {
    return (meta, dom, node, ctxt) => result(meta, with$Children(
        dom,
        node,
        l$map(
            $list,
            (todo: T) => item(todo)(dom, ctxt)
        )
    ))
}