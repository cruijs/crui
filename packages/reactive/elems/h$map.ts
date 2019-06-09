import { Component } from '@crui/core/dom';
import { R$L } from '../rx';
import { $map } from '../rx/list/map';
import { with$Children } from './$children';

export function h$map<T, C, D>(
    container: Component<C>,
    $list: R$L<T>,
    item: (i: T) => Component<D>
): Component<C & D> {
    return (dom, ctxt) => with$Children(
        dom,
        container(dom, ctxt),
        $map(
            $list,
            (todo: T) => item(todo)(dom, ctxt)
        )
    )
}