import { Emitter } from '../../scheduler'
import { AnyNodeAction, AnySetupAction, Drivers } from '../../types'
import { pushAll } from '../../utils/array'
import { bind, constMap, Deferred, map, then, waitAll } from '../../utils/deferred'
import { CreateTag } from '../createTag'
import { emptyElem } from '../emptyElem'
import { EventDriver, EventType } from '../event'
import { replace, Replace } from '../replace'
import { Template, TemplateDriver, TemplateType } from './action'
import { DynamicNodeDriver, DynamicNodeType, DynamicSetupDriver, DynamicSetupType } from './dynamic'

type N = Node

type LazyN<V> = {
    path: NodePath,
    make: (item: V) => AnyNodeAction
}
type LazyS<V> = {
    path: NodePath,
    make: (item: V) => AnySetupAction
}
type LazyNode<V> = {
    node: N,
    make: (item: V) => AnyNodeAction
}
type LazySetup<V> = {
    node: N,
    make: (item: V) => AnySetupAction
}
type NodePath = number[]
type TemplateNode<V> = {
    template: N,
    lazyNodes: LazyN<V>[]
    lazySetups: LazyS<V>[]
}

export const makeTemplateDriver = <
    V = any,
    E extends AnyNodeAction<N> = any
>(): TemplateDriver<N, V, E, CreateTag<N>|Replace<N>> => ({
    [TemplateType]: (parent, action, emitter) => {
        const templateNode = compile<V, E>(parent, action, emitter)

        return (item: V): Deferred<N> => (
            bind(templateNode, ({ template, lazyNodes, lazySetups }) => {
                const root = template.cloneNode(true)
                const lazies = lazyNodes.map(({ path, make }) => {
                    const stub = nodeFromPath(root, path)
                    return bind(
                        // if E is emittable, all dynamics are too
                        emitter.emit(root, make(item) as any),
                        (node) => emitter.emit(
                            stub.parentNode!,
                            replace(stub, node)
                        )
                    )
                })
                pushAll(lazies, lazySetups.map(({ path, make }) =>
                    emitter.emit(
                        nodeFromPath(root, path),
                        // if E is emittable, all dynamics are too
                        make(item) as any 
                    )
                ))

                return constMap(root, waitAll(lazies))
            })
        )
    }
})

type Provide<D, V> = D
    & EventDriver<N>
    & DynamicSetupDriver<N, V, AnySetupAction>
    & DynamicNodeDriver<N, V, AnyNodeAction>

function compile<V, E extends AnyNodeAction<N>>(
    parent: N,
    { elem }: Template<V, E, N>,
    emitter: Emitter<N, E|Replace<N>|CreateTag<N>, any>,
): Deferred<TemplateNode<V>> {
    const lazyNodes: LazyNode<V>[] = []
    const lazySetups: LazySetup<V>[] = []

    const e = emitter.withDrivers(<D extends Drivers<N>>(d: D): Provide<D, V> => ({
        ...d,
        [DynamicSetupType]: (node, { make }) => {
            lazySetups.push({ node, make })
        },
        [DynamicNodeType]: (parent, { make }, { emit }) => then(
            emit(parent, emptyElem),
            (node) => lazyNodes.push({ node, make })
        ),
        [EventType]: (node, action) => {
            const make = () => action
            lazySetups.push({ node, make })
        }
    }))

    return map(
        e.emit(parent, elem),
        (root) => ({
            template: root,
            lazyNodes: lazyNodes.map(({ node, make }) => ({
                path: calcPath(root, node),
                make
            })),
            lazySetups: lazySetups.map(({ node, make }) => ({
                path: calcPath(root, node),
                make
            })),
        })
    )
}

function calcPath(root: N, node: N): NodePath {
    let cur = node
    const path: NodePath = []
    while (cur.parentNode && cur !== root) {
        const ns = cur.parentNode.childNodes
        for (let i = 0; i < ns.length; ++i) {
            if (ns[i] === cur) {
                path.push(i)
                break
            }
        }
        cur = cur.parentNode
    }
    return path.reverse()
}

function nodeFromPath(root: N, path: NodePath): N {
    return path.reduce((z, i) => z.childNodes[i], root)
}