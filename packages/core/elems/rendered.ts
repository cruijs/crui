import { AsyncUnmount, Node, Unsubscribe } from '../type';
import { combine, combineAsync } from '../utils/combine';
import { asyncNoop, noop } from '../utils/noop';

export type Rendered<N extends Node = Node> = Cleanup & {
    node: N,
}
export type Cleanup = {
    unsub: Unsubscribe,
    beforeUnmount: AsyncUnmount,
}

export const defCleanup: Cleanup = {
    unsub: noop,
    beforeUnmount: asyncNoop
}

type CollectCleanup = {
    unsubs: Unsubscribe[],
    bu: AsyncUnmount[],
}
export function mergeCleanups(cs: Cleanup[]): Cleanup {
    if (cs.length === 0) {
        return defCleanup
    }
    if (cs.length === 1) {
        return cs[0]
    }

    const collected = cs.reduce(
        (z, c) => {
            z.unsubs.push(c.unsub)
            z.bu.push(c.beforeUnmount)
            return z
        },
        { unsubs: [], bu: [] } as CollectCleanup
    )
    return {
        unsub: combine(collected.unsubs),
        beforeUnmount: combineAsync(collected.bu)
    }
}