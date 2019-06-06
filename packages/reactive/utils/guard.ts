import { Fn0 } from '@crui/core/utils/combine'

export type Cancel = () => void
export type Guard = (f: Fn0) => Fn0
export const makeGuard = () => {
    let canRun = true
    const guard: Guard = (f) => () => {
        canRun && f()
    }
    const cancel = () => {
        canRun = false
    }
    return { guard, cancel }
}