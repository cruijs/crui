import { Drivers, Action, Fn0 } from '../types'
import { schedule } from '../scheduler/scheduler'
import { MockNode } from './mockNode'

export const mockSchedule = (drivers: Drivers, action: Action) => {
    let step: Fn0
    const controlled = (f: Fn0) => step = f
    const root = new MockNode('root')

    schedule(controlled, root, drivers, action)
    return {
        root,
        next: () => {
            step()
        }
    }
}