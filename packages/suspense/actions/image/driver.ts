import { AnySetupAction, bind, constMap, createTag, CreateTag, EventAction, Prop, prop, waitAll, on } from '@crui/core'
import { WaitFor, waitFor } from '../suspend/waitFor'
import { ImageDriver, ImageType } from './action'

type AReq<N> = CreateTag<N>|Prop<any>|WaitFor|EventAction
export const makeImageDriver = <N, A extends AnySetupAction = any>(
): ImageDriver<N, A, AReq<N>> => ({
    [ImageType]: (_, { src, actions }, { emit }) => (
        bind(
            emit(_, createTag('img')),
            (img) => {
                const ds = actions.map((a) => emit(img, a))
                const p = new Promise<void>((resolve, reject) => {
                    ds.push(
                        emit(img, prop('src', src)),
                        emit(img, on('onload', () => resolve())),
                        emit(img, on('onerror', (e: ErrorEvent) => {
                            reject(new Error(e.message))
                        })),
                    )
                })
                ds.push(emit(_, waitFor(p)))

                return constMap(img, waitAll(ds))
            }
        )
    )
})