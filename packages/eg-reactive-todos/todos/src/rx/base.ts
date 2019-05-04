import { Effect, Stream, Unsubscribe } from '../../../../src/type';

export abstract class BaseStream<T, U = T> implements Stream<T, U> {
    protected value: T
    private readonly listeners: Effect<U>[]

    constructor(val: T) {
        this.value = val
        this.listeners = []
    }

    get() {
        return this.value
    }

    subscribe(eff: Effect<U>): Unsubscribe {
        this.listeners.push(eff)
        return () => {
            this.listeners.splice(
                this.listeners.indexOf(eff),
                1
            )
        }
    }

    protected notify(upd: U): void {
        this.listeners.forEach((eff) => {
            eff(upd)
        })
    }
}