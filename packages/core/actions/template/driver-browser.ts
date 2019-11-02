import { Emitter } from '../../scheduler'
import { Action, AnyNodeAction, Drivers } from '../../types'
import { bind, constMap, Deferred, map, waitAll } from '../../utils/deferred'
import { EventDriver, EventType } from '../event'
import { Template, TemplateDriver, TemplateType } from './action'
import { DynamicDriver, DynamicType } from './dynamic'

type N = Node

type Lazy<V> = {
    path: NodePath, make: (item: V) => Action
}
type LazyAction<V> = {
    node: N,
    make: (item: V) => Action
}
type NodePath = number[]
type TemplateNode<V> = {
    template: N,
    lazies: Lazy<V>[]
}

export const makeTemplateDriver = <
    V = any,
    E extends AnyNodeAction<N> = any
>(): TemplateDriver<N, V, E> => ({
    [TemplateType]: (parent, action, emitter) => {
        const templateNode = compile(parent, action, emitter)

        return (item: V): Deferred<N> => (
            bind(templateNode, ({ template, lazies }) => {
                const root = template.cloneNode(true)
                return constMap(
                    root,
                    waitAll(
                        lazies.map(({ path, make }) =>
                            emitter.emit(
                                nodeFromPath(root, path),
                                make(item) as E
                            )
                        )
                    ),
                )
            })
        )
    }
})

type Provide<D, V> =
    D & DynamicDriver<V, Action, N> & EventDriver<N>

function compile<V, E extends AnyNodeAction<N>, D extends Drivers<N>>(
    parent: N,
    { elem }: Template<V, E, N>,
    emitter: Emitter<N, E, D>,
): Deferred<TemplateNode<V>> {
    const lazyActions: LazyAction<V>[] = []
    const e = emitter.withDrivers((d: D): Provide<D, V> => ({
        ...d,
        [DynamicType]: (node, { make }) => {
            lazyActions.push({ node, make })
            return node
        },
        [EventType]: (node, action) => {
            const make = () => action
            lazyActions.push({ node, make })
            return node
        }
    }))

    return map(
        e.emit(parent, elem),
        (root) => {
            const lazies = lazyActions.map(({ node, make }) => ({
                path: calcPath(root, node),
                make
            }))
            return { template: root, lazies }
        }
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