import { mockDrivers } from '../../mocks/drivers'
import { extract } from '../../mocks/extract'
import { makeExtractDriver, RetValue } from '../../mocks/extract/driver-mock'
import { MockNode } from '../../mocks/mockNode'
import { schedule } from '../../scheduler'
import { Action, Fn0 } from '../../types'
import { pipe } from '../../utils/deferred'
import { makeElemDriver } from '../elem/driver'
import { h } from '../elem/index'
import { prop } from '../prop/index'
import { text } from '../text'
import { MakeItem, template } from './action'
import { makeDynAdaptDriver } from './adapt/driver'
import { dynAdapt } from './adapt/index'
import { makeTemplateDriver } from './driver-browser'
import { dynNode } from './dynamic/node'
import { dynSetup } from './dynamic/setup'

type Result = MakeItem<string, MockNode>
const ret: RetValue<Result> = {}

const drivers = {
    ...mockDrivers,
    ...makeElemDriver<MockNode>(),
    ...makeTemplateDriver<string, MockNode>(),
    ...makeExtractDriver(ret),
    ...makeDynAdaptDriver<MockNode>()
}

const sync = (f: Fn0) => f()
const run = <A extends Action>(action: A): Result => {
    schedule(sync, new MockNode('root'), drivers, extract(template(action)))
    return ret.value!
}

describe('templateDriver', () => {
    it('can handle dynamic setups', (done) => {
        const make = run(h('div', [
            dynSetup((id: string) => prop('id', id))
        ]))

        pipe(make('test'), (node) => {
            expect(node.props.id).toBe('test')
            done()
        })
    })

    it('can handle dynamic nodes', (done) => {
        const make = run(h('div', [], [
            text('first'),
            dynNode((data: string) => text(data)),
            text('third')
        ]))

        pipe(make('test'), (node) => {
            expect(node.childNodes.map((n) => n.value)).toEqual([
                'first',
                'test',
                'third'
            ])
            done()
        })
    })

    it('can handle adapted dynamics', (done) => {
        const make = run(dynAdapt(
            (str: string) => parseInt(str),
            h('div', [
                dynSetup((n: number) => prop('id', (n * 10).toString()))
            ])
        ))

        pipe(make('10'), (node) => {
            expect(node.props.id).toBe('100')
            done()
        })
    })
})