import { attr, mount, noop, prop } from '@crui/core'
import { mockDrivers, MockNode } from '@crui/core/mocks'
import { schedule } from '@crui/core/scheduler/scheduler'
import { WaitForDriver, WaitForType } from '../suspend/waitFor'
import { image, ImageElem } from './action'
import { makeImageDriver } from './driver'

let waitP: PromiseLike<any>
const waitForDriver: WaitForDriver = {
    [WaitForType]: (_, { promise }) => {
        waitP = promise
    }
}
const drivers = {
    ...mockDrivers,
    ...waitForDriver,
    ...makeImageDriver()
}

const trigger = <E extends Event>(node: MockNode, on: string, ev: E) => {
    node.events[on].forEach((handle) => handle(ev))
}

const errorEv = (message: string) =>
    new ErrorEvent('', { message })

const exec = (image: ImageElem<any>) => {
    const root = new MockNode('root')
    schedule(noop, root, drivers, mount(image))
    return root.childNodes[0]
}

describe(image, () => {
    it('generates an image', () => {
        const img = exec(image('test', [
            attr('alt', 'hello'),
            prop('width', '200px'),
            prop('src', 'wrong')
        ]))

        expect(img.tag).toBe('img')
        expect(img.attrs.alt).toBe('hello')
        expect(img.props).toEqual({ src: 'test', width: '200px' })
    })

    it('fulfils promise once loaded', () => {
        const img = exec(image('test'))
        trigger(img, 'load', new Event(''))

        return waitP
    })

    it('fails if there is any error while loading', (done) => {
        const img = exec(image('test'))
        trigger(img, 'error', errorEv('failed'))

        waitP.then(
            () => { throw new Error('should fail') },
            (err: Error) => {
                expect(err.message).toBe('failed')
                done()
            }
        )
    })
})