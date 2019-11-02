import { Drivers, Unsubscribe } from '../../types'
import { pipe } from '../../utils/deferred'
import { noop } from '../../utils/noop'
import { DestroyableDriver, DestroyableType } from './action'
import { CleanupDriver, CleanupType } from './cleanup'
import { DestroyDriver, DestroyType } from './destroy'

type Provide<N, D extends Drivers<N>> =
    D & CleanupDriver<N>

type DDrivers<N> = DestroyableDriver<N> & DestroyDriver<N> & CleanupDriver<N>
export function makeDestroyableDriver<N extends object>(): DDrivers<N> {
    const cleanups = new WeakMap<N, Unsubscribe[]>()

    return {
        [CleanupType]: noop,
        [DestroyableType]: (parent, { elem }, emitter) => {
            const unsubs: Unsubscribe[] = []
            const d = emitter
                .withDrivers(<D extends Drivers<N>>(d: D): Provide<N, D> => ({
                    ...d,
                    [CleanupType]: (_, { unsub }) => {
                        unsubs.push(unsub)
                    },
                }))
                .emit(parent, elem)

            pipe(d, (node) => {
                cleanups.set(node, unsubs)
            })
            return d
        },
        [DestroyType]: (node) => {
            const unsubs = cleanups.get(node)
            if (unsubs)
                unsubs.forEach((f) => f())
        }
    }
}