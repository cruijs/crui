import { Drivers } from '../../types'
import { bind, then } from '../../utils/deferred'
import { append } from '../append'
import { Handler, OnMountedDriver, OnMountedType } from './onMounted'
import { MountDriver, MountType } from './action'

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

type MapLike<K, V> = {
    get(key: K): V|undefined
    set(key: K, value: V): void
}
function mapPush<K, V>(map: MapLike<K, V[]>, key: K, value: V): void {
    const list = map.get(key)
    if (list == null)
        map.set(key, [value])
    else
        list.push(value)
}