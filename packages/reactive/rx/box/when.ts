import { Unsubscribe } from '../../../core/types';
import { noop } from '@crui/core/utils/noop';
import { apply } from './apply';
import { R$B } from './types';

export function when(cond: R$B<boolean>, then: () => Unsubscribe): Unsubscribe {
    let unsub = noop
    return apply(cond, (val) => {
        if (val)
            unsub = then()
        else
            unsub()
    })
}