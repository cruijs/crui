import { noop } from '@crui/core/utils/noop';
import { Unsubscribe } from '@crui/reactive/node_modules/@crui/core/type';
import { StreamBox } from './index';

export function when(cond: StreamBox<boolean>, then: () => Unsubscribe): Unsubscribe {
    let unsub = noop
    return cond.apply((val) => {
        if (val)
            unsub = then()
        else
            unsub()
    })
}