import { Stream } from '../stream';

type FMap<A, B> = (v: A) => B
export class StreamBox<T> extends Stream<T> {
    set(val: T) {
        this.value = val
        this.notify(val)
    }

    map<P>(f: FMap<T, P>): StreamBox<P> {
        const $box = new StreamBox(f(this.get()))
        $box.addUnsub(this.subscribe((val) => {
            $box.set(f(val))
        }))
        return $box
    }

    clone(): StreamBox<T> {
        const $box = new StreamBox(this.get())
        $box.addUnsub(this.subscribe((val) => {
            $box.set(val)
        }))
        return $box
    }
}