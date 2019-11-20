import { Action, Driver, Fn0, SetupAction, Cleanup } from '@crui/core'
import { action } from '@crui/core/actions/action'

export const OnSceneResizeType = Symbol('onSceneResize')
export type OnSceneResize = SetupAction<
    typeof OnSceneResizeType,
    OnSceneResizeDriver
> & {
    handler: Fn0
}

export type OnSceneResizeDriver<N = any, S extends Action = never> = {
    [OnSceneResizeType]: Driver<N, OnSceneResize, S|Cleanup>
}

export function onSceneResize(handler: Fn0): OnSceneResize {
    return action({
        type: OnSceneResizeType,
        handler,
    })
}