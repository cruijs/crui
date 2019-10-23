import { Driver, Action, AnyAction } from '../../types'
import { action } from '../action'

export const TextType = Symbol('text')
export type TextDriver<N = any, R = N, S extends AnyAction = AnyAction> = {
    [TextType]: Driver<N, TextElem, S, R>
}
export type TextElem =
    Action<
        typeof TextType,
        TextDriver
    > & {
        data: string
    }

export function text(data: string): TextElem {
    return action({
        type: TextType,
        data,
    })
}