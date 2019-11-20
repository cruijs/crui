import { Action, AppendType, AttrType, Cleanup, Driver, Drivers, InsertAtType, PropType, RemoveType, ReplaceType, StyleType, then } from '@crui/core'
import { Emitter } from '@crui/core/scheduler/emitter'
import { bind, bind_, constMap, Deferred } from '@crui/core/utils/deferred'
import { SetNodeValueType } from '@crui/reactive'
import { WDim } from '../../dimensions'
import { calcDimensions, CalcDimensions } from '../calcDimensions/action'
import { onSceneResize, OnSceneResize } from '../onSceneResize/action'
import { RecalcDimType } from '../recalcDim'
import { MeasureDriver, MeasureType } from './action'

export const makeMeasureDriver = <N>(): MeasureDriver<N, any, CalcDimensions|Cleanup|OnSceneResize> => ({
    [MeasureType]: (parent, { dim, elem }, e) => {
        // currently there is no way to have a generic Object indexed by Symbol
        const drivers = recalculateOn(dim, [
            PropType,
            AttrType,
            AppendType,
            ReplaceType,
            InsertAtType,
            RemoveType,
            StyleType,
            SetNodeValueType,
            RecalcDimType
        ] as any[])

        const emitter = e.withDrivers(drivers)
        return bind_(
            emitter.emit(parent, elem),
            (node) => {
                const recalc = () => {
                    recalculate(dim, node, emitter)
                }
                emitter.emit(node, onSceneResize(recalc))
                return emitter.emit(node, onMounted(recalc))
            }
        )
    }
})

const recalculateOn = <D extends Drivers, S extends keyof D>(dim: WDim, actionsType: S[]) => (d: Readonly<D>) => {
    return actionsType.reduce(
        (z: D, type) => {
            if (z[type] !== undefined) {
                z[type] = withRecalc(dim, z[type]) as D[S]
            }
            return z
        },
        {...d}
    )
}

function withRecalc<
    N,
    A extends Action,
    S extends Action,
    R,
    D
>(
    dim: WDim,
    driver: Driver<N, A, S|CalcDimensions, R, D>
): Driver<N, A, S|CalcDimensions, R, D> {
    return (node, action, emitter) => {
        const recalc = (result: R) => (
            constMap(
                result, 
                recalculate(dim, node, emitter)
            )
        )

        const res = driver(node, action, emitter)
        return res instanceof Deferred ? bind(res, recalc) : recalc(res)
    }
}

function recalculate<N>(dim: WDim, node: N, emitter: Emitter<N, CalcDimensions>) {
    return then(
        emitter.emit(node, calcDimensions),
        (rect) => {
            dim.top.set(rect.top)
            dim.left.set(rect.left)
            dim.width.set(rect.width)
            dim.height.set(rect.height)
        }
    )
}