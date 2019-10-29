import { Action, EventAction, EventDriver, EventType, Fn0, GetPropDriver, GetPropType, noop, PropDriver, PropType } from '@crui/core'
import { CleanupDriver, CleanupType } from '@crui/core/actions/destroyable/cleanup'
import { Emitter, schedule } from '@crui/core/scheduler'
import { completed } from '@crui/core/utils/deferred'
import { StreamBox } from '../../rx/box/stream'
import { bindCheckedDriver, bindValueDriver } from './driver'
import { bindChecked, BindCheckedDriver, bindValue, BindValueDriver, BindValueType } from './index'

type N = {
    event: EventAction
    props: {
        type: string,
        value: string,
        checked: boolean,
    }
}

let trigger: Fn0
const mockAsync = (f: Fn0) => trigger = f

type Drivers = 
    BindValueDriver<N>
    & BindCheckedDriver<N>
    & PropDriver<N, 'value'|'checked'>
    & GetPropDriver<'value'|'checked', N>
    & EventDriver<N>
    & CleanupDriver<N>

const testDrivers: Drivers = {
    [CleanupType]: noop,
    [EventType]: (n, action) => {
        n.event = action
    },
    [PropType]: (n, { name, value }) => {
        n.props[name] = value as never
    },
    [GetPropType]: (n, { name }: { name: 'value'|'checked' }) => (
        n.props[name]
    ),
    ...bindValueDriver,
    ...bindCheckedDriver
}

describe('bind', () => {
    let node: N

    beforeAll(() => {
        node = {
            props: {
                type: '',
                value: '',
                checked: false
            }
        } as N
    })

    describe('value', () => {
        let stream: StreamBox<string>

        beforeEach(() => {
            stream = new StreamBox('init')
            schedule(mockAsync, node, testDrivers, bindValue(stream))
        })

        it('is initialised as the stream value', () => {
            expect(node.props.value).toEqual('init')
        })

        it('is synced with stream', () => {
            stream.set('test')
            trigger()
            expect(node.props.value).toEqual('test')
        })

        it('on change sets the stream', () => {
            node.props.value = 'node test'
            node.event.handler(0 as any)
            trigger()

            expect(stream.get()).toEqual('node test')
        })
    })

    describe('checked', () => {
        let stream: StreamBox<boolean>

        beforeEach(() => {
            stream = new StreamBox<boolean>(true)
            schedule(mockAsync, node, testDrivers, bindChecked(stream))
        })

        it('sets input type to checkbox', () => {
            expect(node.props.type).toEqual('checkbox')
        })
    })

    it('does not set prop after event', () => {
        const actions: Action[] = []
        const mockEmitter = {
            emit(_, action: Action) {
                actions.push(action)
                return completed('test')
            },
        } as Emitter<N, any, any>

        const stream = new StreamBox('init')
        const bindAction = bindValue(stream)

        bindValueDriver[BindValueType](
            node, bindAction, mockEmitter
        )

        const event = actions.splice(0, actions.length)[2] as EventAction
        event.handler(0 as any)

        expect(actions).toHaveLength(1)
        expect(actions[0].type).toBe(GetPropType)
    })
})