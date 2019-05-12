import { Stream } from './stream';
import { Unsubscribe } from '../../core/type'

export class StreamBox<T> extends Stream<T> {
    set(val: T) {
        this.value = val
        this.notify(val)
    }

    map<P>(f: (val: T) => P): { stream: StreamBox<P>, unsub: Unsubscribe } {
        const stream = new StreamBox(f(this.get()))
        const unsub = this.subscribe((val) => {
            stream.set(f(val))
        })
        return { stream, unsub }
    }
}