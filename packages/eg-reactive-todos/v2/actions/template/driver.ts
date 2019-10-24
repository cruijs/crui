import { Tag } from '@crui/core/types'
import { bind, constMap, Deferred, map, waitAll } from '../../deferred'
import { Emitter } from '../../emitter'
import { AnyAction, Drivers } from '../../types'
import { createTag, CreateTag } from '../createTag'
import { EventAction, EventDriver, EventType } from '../event'
import { DynamicDriver, DynamicType } from './dynamic'
import { Template, TemplateDriver, TemplateType } from './index'

type N = Node

type Lazy<V, A extends AnyAction> = {
    path: NodePath, make: (item: V) => AReq<A>
}
type LazyAction<V, A extends AnyAction> = {
    node: N,
    make: (item: V) => AReq<A>
}
type NodePath = number[]
type TemplateNode<V, A extends AnyAction> = {
    template: N,
    lazies: Lazy<V, A>[]
}

type AReq<A extends AnyAction> = A | EventAction | CreateTag<N>

export const makeTemplateDriver = <
    V = any,
    T extends Tag = any,
    A extends AnyAction = any
>(): TemplateDriver<V, T, AReq<A>, N> => ({
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
                                make(item)
                            )
                        )
                    ),
                )
            })
        )
    }
})

type Provide<D, V, A extends AnyAction> =
    D & DynamicDriver<V, A, N> & EventDriver<N>

function compile<V, T extends Tag, A extends AnyAction, D extends Drivers<N>>(
    parent: N,
    { tag, actions }: Template<V, T, A, N>,
    emitter: Emitter<N, AReq<A>, D>,
): Deferred<TemplateNode<V, A>> {
    const lazyActions: LazyAction<V, A>[] = []
    const e = emitter.withDrivers((d: D): Provide<D, V, A> => ({
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
        bind(
            e.emit(parent, createTag(tag)),
            (root) => constMap(
                root,
                waitAll(actions.map((a) => e.emit(root, a)))
            )
        ),
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