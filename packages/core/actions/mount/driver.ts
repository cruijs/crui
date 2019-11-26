import { Drivers, Fn0 } from '../../types'
import { bind, then } from '../../utils/deferred'
import { append } from '../append'
import { MountDriver, MountType } from './action'
import { Handler, OnMountedDriver, OnMountedType } from './onMounted'

const invoke = (f: Fn0) => f()
export const makeMountDriver = <N extends object>(): MountDriver<N> => {
    let handlers: Handler[] = []

    return {
        [MountType]: (root, { elem }, emitter) => {
            const drivers = <D extends Drivers>(d: D): D & OnMountedDriver<N> => ({
                ...d,
                [OnMountedType]: (_, { handler }) => {
                    handlers.push(handler)
                }
            })

            const { emit } = emitter.withDrivers(drivers)

            return bind(
                emit(root, elem),
                (node) => then(
                    emit(root, append(node)),
                    () => {
                        handlers.forEach(invoke)
                        handlers = []
                    }
                )
            )
        }
    }
}