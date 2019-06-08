import { Component, DOM, Tag } from '../dom/index';
import { Props } from '../dom/props';
import { defRendered } from '../dom/rendered';

type KProps = keyof Props
type PProps<K extends KProps> = Pick<Props, K>
/**
 * An element with properties
 */
export function hp<K extends KProps>(tag: Tag, props: PProps<K>): Component<any> {
    return (dom) => {
        const node = dom.create(tag)
        withProps(dom, node, props)

        return defRendered(node)
    }
}

/**
 * Set properties for a node
 */
export function withProps<N, K extends KProps>(dom: DOM<N>, node: N, props?: PProps<K>): void {
    if (props != null) {
        dom.setProps(node, props)
    }
}