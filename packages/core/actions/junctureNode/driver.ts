import { Emitter } from '../../scheduler/emitter'
import { Fn0 } from '../../types'
import { Deferred, map, then, waitAll } from '../../utils/deferred'
import { mapConcat, mapPush } from '../../utils/map'
import { AppendDriver, AppendType } from '../append'
import { cleanup, Cleanup } from '../destroyable/cleanup'
import { InsertAtDriver, InsertAtType } from '../insertAt'
import { OnMounted, onMounted, OnMountedDriver, OnMountedType } from '../mount/onMounted'
import { OnRemove } from '../remove/onRemove'
import { ReplaceDriver, ReplaceType } from '../replace'
import { JunctureNodeDriver, JunctureNodeType } from './action'

type Drivers<N> =
    AppendDriver<N>
    & InsertAtDriver<N>
    & ReplaceDriver<N>

type Enhancer<N> =
    <D extends Drivers<N>>(d: Readonly<D>) => 
        D & OnMountedDriver<N>

type NodeThreads<N> =
    Map<N, Fn0[]>

export const makeJunctureNodeDriver = <N>(
): JunctureNodeDriver<N, OnMounted | OnRemove | Cleanup> => {
    return {
        [JunctureNodeType]: (root, _, emitter) => {
            let mounted = false

            const mountedHandlers: NodeThreads<N> = new Map()
            const hoistMounted = makeHoist(root, mountedHandlers)

            const handleMounted = <R>(parent: N, node: N, res: R): R => {
                hoistMounted(parent, node)

                if (!mounted || parent !== root)
                    return res

                const fs = mountedHandlers.get(node)
                if (!fs)
                    return res

                if (res instanceof Deferred)
                    then(res, () => invokeAll(fs))
                else
                    invokeAll(fs)

                return res
            }

            const drivers: Enhancer<N> = (d) => ({
                ...d,
                [OnMountedType]: (node, { handler }) => {
                    mapPush(mountedHandlers, node, handler)
                },
                [AppendType]: (parent, action, emitter) => (
                    handleMounted(
                        parent,
                        action.node,
                        d[AppendType](parent, action, emitter)
                    )
                ),
                [InsertAtType]: (parent, action, emitter) => (
                    handleMounted(
                        parent,
                        action.node,
                        d[InsertAtType](parent, action, emitter)
                    )
                ),
                [ReplaceType]: (parent, action, emitter) => (
                    handleMounted(
                        parent,
                        action.next, 
                        d[ReplaceType](parent, action, emitter)
                    )
                ),
            })

            return map(
                waitAll([
                    emitter.emit(root, onMounted(() => {
                        mounted = true
                        mountedHandlers.forEach(invokeAll)
                    })),
                    emitter.emit(root, cleanup(() => {
                        mountedHandlers.clear()
                    })),
                ]),
                () => emitter.withDrivers(drivers) as Emitter<N>
            )
        }
    }
}

const invoke = (f: Fn0) => f()
const invokeAll = (fs: Fn0[]) => fs.forEach(invoke)

const makeHoist = <N>(root: N, nodeThreads: NodeThreads<N>) =>
    (parent: N, node: N) => {
        if (parent === root)
            return

        const fs = nodeThreads.get(node)
        if (!fs)
            return

        nodeThreads.delete(node)
        mapConcat(nodeThreads, parent, fs)
    }