import { Drivers } from '../../types'
import { bind, then } from '../../utils/deferred'
import { mapPush } from '../../utils/map'
import { append } from '../append'
import { MountDriver, MountType } from './action'
import { Handler, OnMountedDriver, OnMountedType } from './onMounted'

export const makeMountDriver = <N extends object>(): MountDriver<N> => {
    const handlers: Map<N, Handler<N>[]> = new Map()

    return {
        [MountType]: (root, { elem }, emitter) => {
            const drivers = <D extends Drivers>(d: D): D & OnMountedDriver<N> => ({
                ...d,
                [OnMountedType]: (node, { handler }) => {
                    mapPush(handlers, node, handler)
                }
            })

            const { emit } = emitter.withDrivers(drivers)

            return bind(
                emit(root, elem),
                (node) => then(
                    emit(root, append(node)),
                    () => {
                        handlers.forEach((hs, node) => hs.forEach((handler) => {
                            handler(node)
                        }))
                        handlers.clear()
                    }
                )
            )
        }
    }
}