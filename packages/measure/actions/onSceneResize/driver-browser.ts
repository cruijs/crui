import { cleanup, Fn0 } from '@crui/core'
import { remove } from '@crui/core/utils/array'
import { OnSceneResizeDriver, OnSceneResizeType } from './action'

export const makeOnSceneResizeDriver = (): OnSceneResizeDriver => {
    const handlers: Fn0[] = []
    const invoke = (f: Fn0) => f()

    let to: NodeJS.Timeout|undefined
    const runHandlers = () => {
        to = undefined
        handlers.forEach(invoke)
    }

    window.addEventListener('resize', () => {
        if (to !== undefined)
            clearTimeout(to)

        to = setTimeout(runHandlers, 350)
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