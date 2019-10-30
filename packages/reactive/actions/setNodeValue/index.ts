import { Action, Driver, SetupAction } from '@crui/core'
import { action } from '@crui/core/actions/action'

export const SetNodeValueType = Symbol('setNodeValue')
export type SetNodeValueDriver<N = any,  S extends Action = never> = {
    [SetNodeValueType]: Driver<N, SetNodeValue, S>
}
export type SetNodeValue =
    SetupAction<
        typeof SetNodeValueType,
        SetNodeValueDriver
    > & {
        data: string
    }

export function setNodeValue(data: string): SetNodeValue {
    return action({
        type: SetNodeValueType,
        data,
    })
}