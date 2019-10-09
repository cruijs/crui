import { Drivers, Action } from './types'
import { render } from './scheduler'
import { Emitter } from './emitter'

describe('then emit', () => {
    const TestType = Symbol()
    type TestAction = Action<typeof TestType, Drivers> & {
        type: typeof TestType,
        value: number
    }
    const action = (value: number): TestAction => ({
        type: TestType,
        value,
    } as any)

    const drivers = (executed: number[]) => ({
        [TestType]: (n: any, a: TestAction, e: Emitter<any, TestAction>) => {
            executed.push(a.value)
            if (a.value < 3) {
                e.emit(n, action(a.value + 1))
            }
        }
    })

    it('should execute three actions', () => {
        const executed: number[]= []
        render(0, drivers(executed), action(1))
        expect(executed).toEqual([1, 2, 3])
    })
})