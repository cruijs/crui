import { BaseStream } from './base';

export class StreamBox<T> extends BaseStream<T> {
    set(val: T) {
        this.value = val
        this.notify(val)
    }

    map<P>(f: (val: T) => P): StreamBox<P> {
        const s = new StreamBox(f(this.get()))
        this.subscribe((val) => {
            s.set(f(val))
        })
        return s
    }
}