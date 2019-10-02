import { Props } from '../../../core/dom/props'
import { Tag } from '../../../core/types'

export type Drivers = {
    [k: string]: Driver<AnyAction, AnyAction>
}

type Action<T extends symbol, D extends Drivers, R = {}> = {
    readonly type: T
    _r: R,
    _d: D
}

export type AnyAction = Action<any, any, any>

export type Emitter<A> = {
    emit: Emit<A>
}
export type Emit<A> =
    <N>(node: N, action: A) => void

export type Driver<A, S> =
    <N>(node: N, action: A, emitter: Emitter<S>) => void

export const PropType = Symbol('prop')
export type PropDriver = {
    [PropType]: Driver<Prop<any>, TagR>
}
type Prop<K extends keyof Props> = Action<typeof PropType, PropDriver, TagR> & {
    name: K
    value: Props[K]
}

export function prop<K extends keyof Props>(name: K, value: Props[K]): Prop<K> {
    return {
        type: PropType,
        name,
        value,
        _r: 0 as any,
        _d: 0 as any,
    }
}

type TagR = {
    tag: Tag
}

type TagAction = Action<any, any, TagR>

export const AttrType = Symbol('attr')
export type AttrDriver = {
    [AttrType]: Driver<Attr, TagR>
}
type Attr = Action<typeof AttrType, AttrDriver, TagR> & {
    name: string,
    value: string,
}

export function attr(name: string, value: string): Attr {
    return {
        type: AttrType,
        name,
        value,
        _r: 0 as any,
        _d: 0 as any,
    }
}

export const ElemType = Symbol('h')
export type ElemDriver<A extends TagAction> = {
    [ElemType]: Driver<Elem<any, A>, A>
}

type UtoI<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

export type Elem<T extends Tag, A extends TagAction> =
    Action<
        typeof ElemType,
        ElemDriver<A> & UtoI<A['_d']>,
        A['_r']
    > & {
        tag: T
        actions: readonly A[]
    }

export function h<T extends Tag, A extends TagAction>(tag: T, actions: readonly A[]): Elem<T, A> {
    return {
        type: ElemType,
        tag,
        actions,
        _r: 0 as any,
        _d: 0 as any,
    }
}

const child = h

export const x = h('div', [
    prop('className', 'test'),
    prop('tabIndex', -1),
    child('span', [
        prop('className', 'child'),
        attr('test', 'er'),
    ])
])

export function elemDriver<N, A extends TagAction>(parent: N, action: Elem<any, A>, scheduler: Emitter<A | Create<N> | Append<N>>) {
    scheduler.emit(parent, create(action.tag, (node: N) => {
        action.actions.forEach((a) => {
            scheduler.emit(node, a)
        })
        scheduler.emit(parent, append(node))
    }))
}

export const CreateType = Symbol('create')
export type CreateDriver<N> = {
    create: Driver<Create<N>, {}>
}
type Create<N> =
    Action<
        typeof CreateType,
        CreateDriver<N>,
        {}
    > & {
        tag: Tag,
        then: (node: N) => void
    }

function create<N>(tag: Tag, then: Create<N>['then']): Create<N> {
    return {
        type: CreateType,
        tag,
        then,
        _r: 0 as any,
        _d: 0 as any,
    }
}

export const AppendType = Symbol('append')
export type AppendDriver<N> = {
    append: Driver<Append<N>, {}>
}
type Append<N> =
    Action<
        typeof AppendType,
        AppendDriver<N>,
        {}
    > & {
        node: N,
    }

function append<N>(node: N): Append<N> {
    return {
        type: AppendType,
        node,
        _r: 0 as any,
        _d: 0 as any,
    }
}