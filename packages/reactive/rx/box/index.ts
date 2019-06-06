import { Stream, Effect } from '../stream'

type FMap<A, B> = (v: A) => B
export class StreamBox<T> extends Stream<T> {
    set = (val: T) => {
        if (val === this.value)
            return
        this.value = val
        this.notify(val)
    }

    /**
     * Create a new StreamBox with value mapped, similiar to Array.map
     */
    map<P>(f: FMap<T, P>): StreamBox<P> {
        const $box = new StreamBox(f(this.get()))
        $box.addUnsub(this.subscribe((val) => {
            $box.set(f(val))
        }))
        return $box
    }

    /**
     * Create a new StreamBox that is synced to current one.
     * Useful when you want to prevent other parts of the code to destroy this stream.
     */
    clone(): StreamBox<T> {
        const $box = new StreamBox(this.get())
        $box.addUnsub(this.subscribe((val) => {
            $box.set(val)
        }))
        return $box
    }

    /**
     * Subscribe & run effect
     */
    apply(eff: Effect<T>) {
        eff(this.get())
        return this.subscribe(eff)
    }
}