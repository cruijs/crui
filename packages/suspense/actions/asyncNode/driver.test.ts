import { mount } from '@crui/core'
import { mockDrivers, MockNode } from '@crui/core/mocks'
import { schedule } from '@crui/core/scheduler/scheduler'
import { Fn0, noop } from '@crui/core/utils'
import { makeMountDriver } from '../../../core/actions/mount/driver'
import { text } from '../../../core/actions/text/index'
import { testablePromise } from '../../mocks/testablePromise'
import { WaitForDriver, WaitForType } from '../suspend/waitFor'
import { makeAsyncNodeDriver } from './driver'
import { asyncNode } from './index'

let runNext: Fn0
const controlled = (f: Fn0) => runNext = f

const waitForDriver: WaitForDriver = {
    [WaitForType]: noop
}
const drivers = {
    ...mockDrivers,
    ...makeMountDriver<MockNode>(),
    ...makeAsyncNodeDriver<MockNode>(),
    ...waitForDriver
}

describe(asyncNode, () => {
    it('replaces node once promise is fulfilled', (done) => {
        const node = new MockNode('div')
        const testable = testablePromise<string>();

        const action = asyncNode(
            testable.promise,
            (str) => text(str)
        )

        schedule(controlled, node, drivers, mount(action))
        expect(node.childNodes[0].tag).toBe('emptyNode')

        testable.promise.then(() => {
            runNext()
            expect(node.childNodes[0].tag).toBe('text')
            expect(node.childNodes[0].value).toBe('test')
            done()
        })

        testable.resolve('test')
    })
})