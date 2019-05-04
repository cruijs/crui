import { Unsubscribe, Stream } from '../rx/stream';
import { keys, combine, noop } from '@crui/core/utils';

export function h$p<P>(tag: Tag, props: Reactive<P>): Component {
}

type Reactive<P extends {}> = {[K in keyof P]: Stream<P[K]>}
export function withRxProps<N, P extends keyof N>(
    node: N,
    props?: Reactive<{ [K in P]: N[P] }>
): Unsubscribe {
    return !props ? noop :
        combine(keys(props).map((k) => {
            node[k] = props[k].get()
            return props[k].subscribe((val) => {
                node[k] = val
            })
        }))
}