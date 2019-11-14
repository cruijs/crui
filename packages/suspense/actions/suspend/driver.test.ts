import { Fn0, mount, noop, text, hc } from '@crui/core'
import { mockDrivers, MockNode } from '@crui/core/mocks'
import { schedule } from '@crui/core/scheduler/scheduler'
import { makeElemDriver } from '@crui/core/actions/elem/driver'
import { testablePromise, TestablePromise } from '../../mocks/testablePromise'
import { asyncNode } from '../asyncNode'
import { makeAsyncNodeDriver } from '../asyncNode/driver'
import { makeSuspendDriver } from './driver'
import { suspend } from './suspend'


const drivers = {
    ...mockDrivers,
    ...makeSuspendDriver(),
    ...makeAsyncNodeDriver(),
    ...makeElemDriver()
}

let runNext: Fn0
const controlled = (f: Fn0) => runNext = f

const loader = text('loading')
const error = (e: Error) => text(e.message)

// Helper functions to make expectations more readable
type ExpectedNode = ExpectedTag|ExpectedText
type ExpectedTag = { tag: string, children: ExpectedNode[] }
type ExpectedText = { tag: 'text', value: string }

const d = (tag: string, children: ExpectedNode[]): ExpectedTag => 
    ({ tag, children })
const t = (value: string): ExpectedText => 
    ({ tag: 'text', value })
const toResult = (node: MockNode): ExpectedNode => (node.tag === 'text') 
    ? t(node.value)
    : d(node.tag, node.childNodes.map(toResult))

const expectNode = (root: MockNode, expected: ExpectedNode) => {
    expect(toResult(root)).toEqual(expected)
}

const expectLoading = (root: MockNode) => {
    expectNode(root, d('root', [
        t('loading')
    ]))
}

const afterNext = () => new Promise((resolve) => {
    setTimeout(() => {
        runNext()
        resolve()
    })
})

describe(suspend, () => {
    describe('nothing to wait for', () => {
        it('returns the renderd node', () => {
            const root = new MockNode('root')
            const action = suspend(0 as any, 0 as any, text('test'))

            schedule(noop, root, drivers, mount(action))
            expectNode(root, d('root', [
                t('test')
            ]))
        })
    })

    describe('with an async node', () => {
        let root: MockNode
        let testP: TestablePromise<string>

        beforeEach(() => {
            root = new MockNode('root')
            const loader = text('loading')
            const error = (e: Error) => text(e.message)

            testP = testablePromise()
            const aNode = asyncNode(testP.promise, text)

            const action = suspend(loader, error, aNode)

            schedule(controlled, root, drivers, mount(action))
        })

        it('first renders the loader', () => {
            expectLoading(root)
        })

        it('renders error when promise is rejected', async () => {
            testP.reject(new Error('rejected'))
            await afterNext()
            expectNode(root, d('root', [
                t('rejected')
            ]))
        })

        it('renders the node when promise succeed', async () => {
            testP.resolve('resolved')
            // render asyncNode
            await afterNext()
            // replace loader
            await afterNext()
            expectNode(root, d('root', [
                t('resolved')
            ]))
        })
    })

    describe('multiple promises', () => {
        it('wait for all to complete', async () => {
            const root = new MockNode('root')
            const p0 = testablePromise<string>()
            const p1 = testablePromise<string>()
            const p2 = testablePromise<string>()

            const aNode = hc('div', [
                asyncNode(p0.promise, text),
                hc('span', [
                    asyncNode(p1.promise, (a) =>
                        asyncNode(p2.promise, (b) =>
                            text(a + ', ' + b))
                    ),
                ])
            ])

            const action = suspend(loader, error, aNode)
            schedule(controlled, root, drivers, mount(action))

            p0.resolve('first')
            p1.resolve('second')

            // run nested asyncNode
            await afterNext()
            expectLoading(root)
            p2.resolve('third')

            // finish rendering "second, third" text node
            await afterNext()
            expectLoading(root)

            // replace loader with completely rendered node
            await afterNext()
            expectNode(root, d('root', [
                d('div', [
                    t('first'),
                    d('span', [
                        t('second, third'),
                    ])
                ])
            ]))
        })
    })
})