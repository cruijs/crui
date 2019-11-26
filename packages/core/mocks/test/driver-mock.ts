import { TestActionType, TestDriver } from './action'

export const testActionMockDriver: TestDriver = {
    [TestActionType]: (node, { exec }, emitter) => 
        exec(node, emitter)
}