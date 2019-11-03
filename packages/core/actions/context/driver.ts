import { Action, Drivers } from '../../types'
import { SetContextDriver, SetContextType } from './setContext'
import { UseContextDriver, UseContextType } from './useContext'

export function makeContextDriver<N, C = any, A extends Action = any>(
): SetContextDriver<N, C, A> {
    return {
        [SetContextType]: (node, { wrapped, context }, emitter) => {
            const modifyD = <D extends Drivers, A extends Action>(
                d: D
            ): D & UseContextDriver<N, C, A> => ({
                ...d,
                [UseContextType]: (child, { make }, { emit }) =>
                    emit(child, make(context))
            })

            return emitter.withDrivers(modifyD).emit(node, wrapped)
        }
    }
}