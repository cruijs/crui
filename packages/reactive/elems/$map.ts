import { AnyTag, Component, Tag } from '@crui/core/dom';
import { Setup } from '@crui/core/dom';
import { R$L } from '../rx';
import { $map } from '../rx/list/map';
import { with$Children } from './$children';

/**
 * Map a stream of items I into children and setup them in an element
 */
export function s$map<T extends Tag, I, C, D>(
    $list: R$L<I>,
    item: (i: I) => Component<AnyTag, D>
): Setup<T, C & D> {
    return (dom, node, ctxt) => with$Children(
        dom,
        node,
        $map(
            $list,
            (todo: I) => item(todo)(dom, ctxt)
        )
    )
}