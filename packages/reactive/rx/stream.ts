export type Effect<U> = (upd: U) => void
export type Unsubscribe = () => void

export abstract class Stream<T, U = T> {
    protected value: T
    private readonly listeners: Effect<U>[]

    constructor(val: T) {
        this.value = val
        this.listeners = []
    }

    abstract set(val: T): void

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