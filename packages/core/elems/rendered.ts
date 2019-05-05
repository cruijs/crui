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
    us: Unsubscribe[],
    bs: AsyncUnmount[],
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
            z.us.push(c.unsub)
            z.bs.push(c.beforeUnmount)
            return z
        },
        { us: [], bs: [] } as CollectCleanup
    )
    return {
        unsub: combine(collected.us),
        beforeUnmount: combineAsync(collected.bs)
    }
}