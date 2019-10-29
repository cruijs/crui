import { Cleanup, cleanup, EventAction, GetProp, getProp, noop, on, pipe, prop, Prop } from '@crui/core'
import { compatibleInputEvent } from '@crui/core/dom/events'
import { Emitter } from '@crui/core/scheduler/emitter'
import { DRW$B } from '../../rx'
import { apply } from '../../rx/box'
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
        let shouldUpdate = true
        const event = compatibleInputEvent(node)

        then(node, emit)
        apply(stream, (val) => {
            if (shouldUpdate)
                emit(node, prop(name, val as never))
            shouldUpdate = true
        })

        emit(node, cleanup(stream.destroy))

        return emit(node, on<BVTag>(event, () => {
            pipe(emit(node, getProp(name)), (val) => {
                shouldUpdate = false 
                stream.set(val)
            })
        }))
    }
}