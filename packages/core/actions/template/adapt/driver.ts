import { Action } from '../../../types'
import { DynamicNodeDriver, DynamicNodeType, dynNode } from '../dynamic/node'
import { DynamicSetupDriver, DynamicSetupType, dynSetup } from '../dynamic/setup'
import { DynAdaptDriver, DynAdaptType } from './index'

type DynamicDrivers<N> = 
    DynamicNodeDriver<N>
    & DynamicSetupDriver<N>


export const makeDynAdaptDriver = <N, T = any, P = any, A extends Action = any>(
): DynAdaptDriver<N, T, P, A> => {
    return ({
    [DynAdaptType]: (node, { adapt, wrapped }, emitter) => {
            const f = <D extends DynamicDrivers<N>>(d: Readonly<D>): D => ({
                ...d,
                [DynamicNodeType]: (node, action, emitter) => d[DynamicNodeType](
                    node,
                    dynNode(compose(adapt, action.make)),
                    emitter
                ),
                [DynamicSetupType]: (node, action, emitter) => d[DynamicSetupType](
                    node,
                    dynSetup(compose(adapt, action.make)),
                    emitter
                )
            })

            return emitter.withDrivers(f).emit(node, wrapped)
        }
    })
}

type F<A, B> = (a: A) => B
function compose<A, B, C>(fa: F<A, B>, fb: F<B, C>): F<A, C> {
    return (a) => fb(fa(a))
}