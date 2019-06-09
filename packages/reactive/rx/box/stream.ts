import { Stream } from '../stream';
import { Effect } from '../types';
import { StreamBox as IStreamBox } from './types';

export class StreamBox<T> extends Stream<T> implements IStreamBox<T> {
    set = (val: T) => {
        if (val === this.value)
            return
        this.value = val
        this.notify(val)
    }

    /**
     * Subscribe & run effect
     */
    apply(eff: Effect<T>) {
        eff(this.get())
        return this.subscribe(eff)
    }
}