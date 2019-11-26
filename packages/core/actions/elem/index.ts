import { Tag, TagMR, TagR } from '../../restrictions/tag'
import { Action, AnyNodeAction, AnySetupAction, Driver, Drivers, NodeAction, RemoveRestr, UtoI } from '../../types'
import { action } from '../action'

export const ElemType = Symbol('elem')
export type ElemDriver<N = any, S extends Action = never> = {
    [ElemType]: Driver<N, Elem, S, N>
}

export type Elem<
    T extends Tag = any,
    D extends Drivers = any,
    R = any
> =
    NodeAction<typeof ElemType, D, R> & {
        tag: T,
        actions: readonly AnySetupAction[],
        children: readonly AnyNodeAction[],
    }

type ElemR<A extends AnySetupAction, C extends AnyNodeAction> = 
    UtoI<RemoveRestr<TagR<any>, A>> & UtoI<C['_restriction']>

type ElemD<A extends AnySetupAction, C extends AnyNodeAction> = 
    ElemDriver & UtoI<A['_drivers']> & UtoI<C['_drivers']>

export function h<T extends Tag, A extends AnySetupAction, C extends AnyNodeAction = never>(
    tag: T,
    actions: readonly TagMR<A, T>[],
    children: readonly C[] = [],
) {
    return hr(tag, actions as any as A[], children)
}

export function hc<T extends Tag, C extends AnyNodeAction>(
    tag: T,
    children: readonly C[] = []
) {
    return hr(tag, [], children)
}

/**
 * Relaxed Element. It should only be used when you want to abstract an element creation, for example:
 * 
 * ```
 * // Notice that here we do add the TagMR restriction to have stricter typing
 * function checkbox<A extends AnySetupAction>(actions: readonly TagMR<A, 'input'>[]) {
 *     return hr('input', [
 *         prop('type', 'checkbox'),
 *         ...actions
 *     ])
 * }
 * 
 * // correcly inferred as Elem<'input', Prop<'type'>|Attr, never>
 * const x = checkbox([attr('test', '1')])
 * ```
 * 
 * This hack is required because Typescript isn't able to infer `A` in `TagMR<A>` but rather will consider it as `TagMR<TagMR<A>>`:
 * ```
 * const x: TagMR<A>
 * h('div', [attr(...), x]) => Elem<'div', Attr|TagMR<TagMR<A>, 'div'>>
 * ```
 * It will also throw a type error because it cannot ensure that `TagMR<A>` is suitable as `TagMR<TagMR<A>>`.
 * 
 * Please note that the above could be solved by explicitly setting A:
 * ```
 * h<'div', Attr|A>('div', [attr(...), x])
 * ```
 * However this can be cumbersome in a complex scenario
 * 
 * As a side note, this will work as expected:
 * ```
 * h('div', [x])
 * ```
 */
export function hr<T extends Tag, A extends AnySetupAction, C extends AnyNodeAction = never>(
    tag: T,
    actions: readonly A[],
    children: readonly C[] = []
): Elem<T, ElemD<A, C>, ElemR<A, C>> {
    return action({
        type: ElemType,
        tag,
        actions,
        children
    })
}