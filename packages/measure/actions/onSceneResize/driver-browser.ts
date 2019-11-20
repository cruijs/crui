import { cleanup, Fn0 } from '@crui/core'
import { remove } from '@crui/core/utils/array'
import { OnSceneResizeDriver, OnSceneResizeType } from './action'

export const makeOnSceneResizeDriver = (): OnSceneResizeDriver => {
    const handlers: Fn0[] = []
    const invoke = (f: Fn0) => f()

    window.addEventListener('resize', () => {
        handlers.forEach(invoke)
    })

    return {
        [OnSceneResizeType]: (_, { handler }, { emit }) => {
            handlers.push(handler)
            emit(_, cleanup(() => {
                remove(handlers, handler)
            }))
        }
    }
}