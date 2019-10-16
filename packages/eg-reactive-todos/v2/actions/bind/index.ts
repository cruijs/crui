import { DRW$B } from '@crui/reactive/rx/box/types'
import { action } from '../action'
import { Action, Driver, AnyAction } from '../../types'
import { TagR } from '../tagAction'

export type $Value = DRW$B<string>
export const BindValueType = Symbol('bindValue')
export type BVTag = 'input' | 'select' | 'textarea'
export type BindValue = 
    Action<
        typeof BindValueType,
        BindValueDriver,
        TagR<BVTag>
    > & {
        stream: $Value
    }

export type BindValueDriver<N = any, S extends AnyAction = AnyAction> = {
    [BindValueType]: Driver<N, BindValue, S>
}

export const bindValue: Bind<$Value, BindValue> = bind

export type $Checked = DRW$B<boolean>
export const BindCheckedType = Symbol('bindChecked')
export type BindChecked = 
    Action<
        typeof BindCheckedType,
        BindCheckedDriver,
        TagR<'input'>
    > & {
        stream: $Checked
    }

export type BindCheckedDriver<N = any, S extends AnyAction = AnyAction> = {
    [BindCheckedType]: Driver<N, BindChecked, S>
}

export const bindChecked: Bind<$Checked, BindChecked> = bind

type Bind<S, A> = (stream: S) => A

function bind(stream: DRW$B<any>) {
    return action({ stream })
}