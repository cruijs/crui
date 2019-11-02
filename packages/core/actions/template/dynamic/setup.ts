import { AnySetupAction, Driver, SetupAction } from '../../../types'
import { action } from '../../action'
import { DynamicR, MakeAction } from './types'

export const DynamicSetupType = Symbol('dynSetup')
export type DynamicSetupDriver<
    N,
    T = any,
    A extends AnySetupAction = AnySetupAction,
> = {
    [DynamicSetupType]: Driver<N, DynamicSetup<T, A>>
}

export type DynamicSetup<T, A extends AnySetupAction> = SetupAction<
    typeof DynamicSetupType,
    DynamicSetupDriver<any, T, A> & A['_drivers'],
    DynamicR<T> & A['_restriction']
> & {
    make: MakeAction<T, A>
}

export function dynSetup<T, A extends AnySetupAction>(
    make: MakeAction<T, A>
): DynamicSetup<T, A> {
    return action({
        type: DynamicSetupType,
        make
    })
}