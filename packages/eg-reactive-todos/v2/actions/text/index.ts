import { Driver, Action, AnyAction } from '../../types'
import { action } from '../action'

export const TextType = Symbol('text')
export type TextDriver<N = any, R = N, S extends AnyAction = AnyAction> = {
    [TextType]: Driver<N, TextAction, S, R>
}
export type TextAction =
    Action<
        typeof TextType,
        TextDriver
    > & {
        data: string
    }

export function text(data: string): TextAction {
    return action({
        type: TextType,
        data,
    })
}