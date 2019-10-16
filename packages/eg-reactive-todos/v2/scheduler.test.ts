import { Fn0 } from '../../core/utils/combine'
import { action } from './actions/action'
import { then } from './deferred'
import { Emitter } from './emitter'
import { schedule } from './scheduler'
import { Action, AnyAction, Drivers } from './types'

const sync = (f: Fn0) => f()

describe('emit multiple actions', () => {
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
        const executed: number[] = []
        schedule(sync, 0, drivers(executed), action(1))
        expect(executed).toEqual([1, 2, 3])
    })
})

describe('action value depends on emitted', () => {
    const AddType = Symbol()
    type Add = Action<typeof AddType, Drivers> & {
        type: typeof AddType,
        value: number
    }
    const add = (value: number): Add => action({
        type: AddType,
        value,
    })

    const MultType = Symbol()
    type Multiply = Action<typeof MultType, Drivers> & {
        type: typeof MultType,
        value: number
    }
    const mult = (value: number): Multiply => action({
        type: MultType,
        value
    })

    const ExprType = Symbol()
    type Expr = Action<typeof ExprType, Drivers> & {
        type: typeof ExprType,
        actions: AnyAction[]
    }
    const expr = (actions: AnyAction[]) => action({
        type: ExprType,
        actions
    })

    type Num = {
        value: number
    }
    const driver: Drivers<Num> = {
        [AddType]: (n, { value }: Add) => {
            n.value += value
            return n
        },
        [MultType]: (n, { value }: Multiply) => {
            n.value *= value
            return n
        },
        [ExprType]: (n, { actions }: Expr, { emit }) => {
            if (actions.length === 0)
                return n

            const d = emit(n, actions.shift()!)
            return (actions.length > 0)
                ? then(d, (n) => emit(n, expr(actions)))
                : d
        }
    }

    it('should execute one after the other', () => {
        const n = { value: 0 }
        schedule(sync, n, driver, expr([
            add(1),
            mult(5),
            add(5),
            mult(2)
        ]))
        expect(n.value).toBe(20)
    })
})