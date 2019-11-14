import { Fn0 } from '@crui/core'
import { mockDrivers, MockNode } from '@crui/core/mocks'
import { schedule } from '@crui/core/scheduler/scheduler'
import { WaitForDriver, WaitForType } from '../suspend/waitFor'
import { image } from './action'

let waitP: PromiseLike<any>
const waitForDriver: WaitForDriver = {
    [WaitForType]: (_, { promise }) => {
        waitP = promise
    }
}
const drivers = {
    ...mockDrivers,
    ...waitForDriver
}

let runNext: Fn0
const controlled = (f: Fn0) => runNext = f
const trigger = <E extends Event>(node: MockNode, on: string, ev: E) => {
    node.events[on].forEach((handle) => handle(ev))
}

const errorEv = (message: string) =>
    new ErrorEvent('', { message })

describe(image, () => {
    it('fails if there is any error while loading', (done) => {
        const root = new MockNode('root')

        schedule(controlled, root, drivers, image('test'))

        const img = root.childNodes[0]
        trigger(img, 'error', errorEv('failed'))

        waitP.then(
            () => { throw new Error('should fail') },
            (err: Error) => {
                expect(err.message).toBe('failed')
                done()
            }
        )

        setTimeout(() => {
            runNext()
        })
    })
})