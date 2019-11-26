import { action } from '../../actions/action'
import { Emitter } from '../../scheduler/emitter'
import { Action, Driver } from '../../types'
import { MockNode } from '../mockNode'

type Exec<R = any> =
    (node: MockNode, emitter: Emitter<MockNode, any>) => R

export const TestActionType = Symbol('testAction')
export type Test<R = any> = Action<
    typeof TestActionType,
    TestDriver
> & {
    exec: Exec<R>
}

export type TestDriver = {
    [TestActionType]: Driver<MockNode, Test, any>
}

export function testAction<R>(exec: Exec<R>): Test<R> {
    return action({
        type: TestActionType,
        exec,
    })
}