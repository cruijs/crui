import { Unsubscribe } from '@crui/core/type';
import { noop } from '@crui/core/utils/noop';
import { R$B } from './types';

export function when(cond: R$B<boolean>, then: () => Unsubscribe): Unsubscribe {
    let unsub = noop
    return cond.apply((val) => {
        if (val)
            unsub = then()
        else
            unsub()
    })
}