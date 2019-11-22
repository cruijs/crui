import { SimpleNode } from '../../dom/simpleNode'
import { Emitter } from '../../scheduler'
import { AnyNodeAction, AnySetupAction, Drivers } from '../../types'
import { pushAll } from '../../utils/array'
import { bind, constMap, Deferred, map, then, waitAll } from '../../utils/deferred'
import { emptyNode, EmptyNode } from '../emptyNode'
import { EventDriver, EventType } from '../event'
import { replace, Replace } from '../replace'
import { Template, TemplateDriver, TemplateType } from './action'
import { DynamicNodeDriver, DynamicNodeType, DynamicSetupDriver, DynamicSetupType } from './dynamic'

type LazyN<V, N> = {
    path: NodePath
    emitter: Emitter<N>
    make: (item: V) => AnyNodeAction
}
type LazyS<V, N> = {
    path: NodePath
    emitter: Emitter<N>
    make: (item: V) => AnySetupAction
}
type LazyNode<V, N> = {
    node: N
    emitter: Emitter<N>
    make: (item: V) => AnyNodeAction
}
type LazySetup<V, N> = {
    node: N
    emitter: Emitter<N>
    make: (item: V) => AnySetupAction
}
type NodePath = number[]
type TemplateNode<V, N> = {
    template: N,
    lazyNodes: LazyN<V, N>[]
    lazySetups: LazyS<V, N>[]
}

export const makeTemplateDriver = <
    V = any,
    N extends SimpleNode = any,
    E extends AnyNodeAction<N> = any
>(): TemplateDriver<N, V, E, EmptyNode<N>|Replace<N>> => ({
    [TemplateType]: (parent, action, emitter) => {
        const templateNode = compile<V, N, E>(parent, action, emitter)

        return (item: V): Deferred<N> => (
            bind(templateNode, ({ template, lazyNodes, lazySetups }) => {
                const root = template.cloneNode(true)
                const lazies = lazyNodes.map(({ path, make, emitter }) => {
                    const stub = nodeFromPath(root, path)
                    return bind(
                        emitter.emit(root, make(item)),
                        (node) => emitter.emit(
                            stub.parentNode!,
                            replace(stub, node)
                        )
                    )
                })
                pushAll(lazies, lazySetups.map(({ path, make, emitter }) =>
                    emitter.emit(
                        nodeFromPath(root, path),
                        make(item)
                    )
                ))

                return constMap(root, waitAll(lazies))
            })
        )
    }
})

type Provide<D, V, N> = D
    & EventDriver<N>
    & DynamicSetupDriver<N, V, AnySetupAction>
    & DynamicNodeDriver<N, V, AnyNodeAction>

function compile<V, N extends SimpleNode, E extends AnyNodeAction<N>>(
    parent: N,
    { elem }: Template<V, E, N>,
    emitter: Emitter<N, E|Replace<N>|EmptyNode<N>, any>,
): Deferred<TemplateNode<V, N>> {
    const lazyNodes: LazyNode<V, N>[] = []
    const lazySetups: LazySetup<V, N>[] = []

    const e = emitter.withDrivers(<D extends Drivers<N>>(d: D): Provide<D, V, N> => ({
        ...d,
        [DynamicSetupType]: (node, { make }, emitter) => {
            lazySetups.push({ node, make, emitter })
        },
        [DynamicNodeType]: (parent, { make }, emitter) => then(
            emitter.emit(parent, emptyNode),
            (node) => lazyNodes.push({ node, make, emitter })
        ),
        [EventType]: (node, action, emitter) => {
            const make = () => action
            lazySetups.push({ node, make, emitter })
        }
    }))

    return map(
        e.emit(parent, elem),
        (root) => ({
            template: root,
            lazyNodes: lazyNodes.map(({ node, make, emitter }) => ({
                path: calcPath(root, node),
                emitter,
                make
            })),
            lazySetups: lazySetups.map(({ node, make, emitter }) => ({
                path: calcPath(root, node),
                emitter,
                make
            })),
        })
    )
}

function calcPath<N extends SimpleNode>(root: N, node: N): NodePath {
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

function nodeFromPath<N extends SimpleNode>(root: N, path: NodePath): N {
    return path.reduce((z, i) => z.childNodes[i], root)
}