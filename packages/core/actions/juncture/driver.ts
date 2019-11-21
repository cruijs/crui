import { Emitter } from '../../scheduler/emitter'
import { Action, AnyNodeAction, Driver } from '../../types'
import { bind_, Deferred, pipe } from '../../utils/deferred'
import { mapConcat, mapPush } from '../../utils/map'
import { AppendDriver, AppendType } from '../append'
import { InsertAtDriver, InsertAtType } from '../insertAt'
import { Handler, onMounted, OnMounted, OnMountedDriver, OnMountedType } from '../mount/onMounted'
import { ReplaceDriver, ReplaceType } from '../replace'
import { JunctureDriver, JunctureType } from './action'

type Drivers<N> =
    AppendDriver<N>
    & InsertAtDriver<N>
    & ReplaceDriver<N>

type Enhancer<N> =
    <D extends Drivers<N>>(d: Readonly<D>) => D & OnMountedDriver<N>

type NodeHandlers<N> =
    Map<N, Handler<N>[]>

export const makeJunctureDriver = <N, E extends AnyNodeAction>(
): JunctureDriver<N, E, OnMounted<N>> => {
    const nodeHandlers: NodeHandlers<N> = new Map()

    return {
        [JunctureType]: (_, { elem }, emitter) => {
            let root: N | undefined

            const enhance = <A extends Action, S extends Action>(
                driver: Driver<N, A, S>,
                action: A,
                emitter: Emitter<N, S>,
                parent: N,
                node: N
            ) => {
                const run = () => {
                    const handlers = nodeHandlers.get(node)
                    if (!handlers)
                        return

                    nodeHandlers.delete(node)
                    if (parent === root)
                        handlers.forEach((handler) => handler(node))
                    else
                        mapConcat(nodeHandlers, parent, handlers)
                }

                const result = driver(parent, action, emitter)
                if (result instanceof Deferred)
                    pipe(result, run)
                else
                    run()

                return result
            }

            const drivers: Enhancer<N> = (d) => ({
                ...d,
                [OnMountedType]: (node, { handler }) => {
                    mapPush(nodeHandlers, node, handler)
                },
                [AppendType]: (p, action, emitter) => {
                    enhance(d[AppendType], action, emitter, p, action.node)
                },
                [InsertAtType]: (p, action, emitter) => {
                    enhance(d[InsertAtType], action, emitter, p, action.node)
                },
                [ReplaceType]: (p, action, emitter) => {
                    enhance(d[ReplaceType], action, emitter, p, action.next)
                },
            })

            return bind_(
                emitter.withDrivers(drivers).emit(_, elem),
                (node) => (
                    emitter.emit(node, onMounted<N>((node) => {
                        root = node
                        runAll(nodeHandlers)
                    }))
                )
            )
        }
    }
}

function runAll<N>(nodeHandlers: Map<N, Handler<N>[]>) {
    nodeHandlers.forEach((hs, node) => hs.forEach((handler) => {
        handler(node)
    }))
    nodeHandlers.clear()
}