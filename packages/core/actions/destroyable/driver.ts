import { Drivers, Unsubscribe } from '../../types'
import { DestroyableDriver, DestroyableType } from './action'
import { CleanupDriver, CleanupType } from './cleanup'
import { DestroyDriver, DestroyType } from './destroy'

type Provide<N, D extends Drivers<N>> =
    D & CleanupDriver<N> & DestroyDriver<N>

export function makeDestroyableDriver<N>(): DestroyableDriver<N> {
    return {
        [DestroyableType]: (node, { action }, emitter) => {
            const cleanups: Unsubscribe[] = []
            return emitter
                .withDrivers(<D extends Drivers<N>>(d: D): Provide<N, D> => ({
                    ...d,
                    [CleanupType]: (_, { unsub }) => {
                        cleanups.push(unsub)
                    },
                    [DestroyType]: () => {
                        cleanups.forEach((f) => f())
                    }
                }))
                .emit(node, action)
        }
    }
}