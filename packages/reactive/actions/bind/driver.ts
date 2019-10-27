import { Cleanup, cleanup, EventAction, GetProp, getProp, noop, on, pipe, prop, Prop } from '@crui/core'
import { compatibleInputEvent } from '@crui/core/dom/events'
import { Emitter } from '@crui/core/scheduler/emitter'
import { DRW$B } from '../../rx'
import { apply } from '../../rx/box'
import { makeAtomic } from '../../utils/atomic'
import { BindCheckedDriver, BindCheckedType, BindValueDriver, BindValueType, BVTag } from './index'

export const bindValueDriver: BindValueDriver<any, AReq<'value'>> = {
    [BindValueType]: bind('value')
}

export const bindCheckedDriver: BindCheckedDriver<any, AReq<'checked'>> = {
    [BindCheckedType]: bind('checked', (node, emit) => {
        emit(node, prop('type', 'checkbox'))
    })
}

type Props = {
    value: string,
    checked: boolean
}

type AReq<P extends keyof Props> = 
    Prop<P>|GetProp<P>|EventAction<BVTag>|Cleanup

function bind<P extends keyof Props>(
    name: P,
    then: (n: any, e: Emitter<any, AReq<any>>['emit']) => void = noop
) {
    return <N>(
        node: N,
        { stream }: { stream: DRW$B<Props[P]> },
        { emit }: Emitter<N, AReq<P>>,
    ) => {
        const atomic = makeAtomic()
        const event = compatibleInputEvent(node)

        then(node, emit)
        emit(node, cleanup(
            apply(stream, atomic((val) => {
                emit(node, prop(name, val as never))
            }))
        ))
        return emit(node, on<BVTag>(event, atomic(() => {
            pipe(emit(node, getProp(name)), (val) => {
                stream.set(val)
            })
        })))
    }
}