import { Stream } from '../stream';
import { RWStreamBox } from './types';

export class StreamBox<T> extends Stream<T, T> implements RWStreamBox<T> {
    set = (val: T) => {
        if (val === this.value)
            return
        this.value = val
        this.notify(val)
    }
}