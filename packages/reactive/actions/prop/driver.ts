import { Cleanup, cleanup, Prop, prop } from '@crui/core'
import { Props } from '@crui/core/dom/props'
import { $PropDriver, $PropType } from './index'

export const makePropDriver = <N, K extends keyof Props = any>(): $PropDriver<N, K, Prop<K>|Cleanup> => ({
    [$PropType]: (node, { name, stream }, { emit }) => {
        const f = (value: Props[K]) => emit(node, prop(name, value))

        stream.subscribe(f)
        emit(node, cleanup(stream.destroy))
        return f(stream.get())
    }
})