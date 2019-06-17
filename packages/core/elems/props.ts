import { Setup, Tag } from '../dom/index';
import { Props } from '../dom/props';
import { defLifecycle } from '../dom/rendered';

type KProps = keyof Props
type PProps<K extends KProps> = Pick<Props, K>

export function props<T extends Tag, K extends KProps>(props: PProps<K>): Setup<T> {
    return (dom, node) => {
        dom.setProps(node, props)
        return defLifecycle()
    }
}