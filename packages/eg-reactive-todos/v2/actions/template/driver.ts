import { Tag } from '@crui/core/types'
import { waitAll, constMap, Deferred, map, thread } from '../../deferred'
import { Emitter } from '../../emitter'
import { AnyAction, Drivers } from '../../types'
import { createTag, CreateTag } from '../createTag'
import { EventType } from '../event'
import { DynamicDriver, DynamicType } from './dynamic'
import { Template, TemplateDriver, TemplateType } from './index'

type N = Node
type T = unknown
type A = AnyAction

type Lazy<T> = {
    path: NodePath,
    make: (item: T) => AnyAction
}
type LazyAction<T> = {
    node: N,
    make: (item: T) => AnyAction
}
type NodePath = number[]
type TemplateNode<T> = {
    template: N,
    lazies: Lazy<T>[]
}

export const templateDriver: TemplateDriver<A, N, T> = {
    [TemplateType]: (parent, action, emitter) => {
        const templateNode = compile(parent, action, emitter)

        return (item: T): Deferred<N> => (
            thread(templateNode, ({ template, lazies }) => {
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
}

function compile<T, A extends AnyAction, D extends A['_drivers']>(
    parent: N,
    { tag, actions }: Template<Tag, A, N>,
    emitter: Emitter<N, A | CreateTag<N>, D>,
): Deferred<TemplateNode<T>> {
    const lazyActions: LazyAction<T>[] = []
    const e = emitter.withDrivers(<D extends Drivers<N>>(d: D): D & DynamicDriver<T, A, N> => ({
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
        thread(
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