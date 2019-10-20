import { Fn0 } from '@crui/core/utils/combine'
import { noop } from '@crui/core/utils/noop'

type Work<T> = (v: T) => void
export class Deferred<T> {
    result?: T
    then: Work<T> = noop
    isDone: Boolean = false

    done(v: T): void {
        this.then(v)
        this.result = v
        this.isDone = true
    }
}

export function then<T>(d: Deferred<T>, f: Work<T>): Deferred<T> {
    pipe(d, f)
    return d
}

export function thread<A, B>(d: Deferred<A>, f: (a: A) => Deferred<B>): Deferred<B> {
    const z = new Deferred<B>()
    then(d, (a) => {
        dependsOn(f(a), z)
    })
    return z
}

export function dependsOn<T>(master: Deferred<T>, slave: Readonly<Deferred<T>>): void {
    pipe(master, (v) => {
        slave.done(v)
    })
}

export function waitAll<T>(ds: Deferred<T>[]): Deferred<T[]> {
    let counter = ds.length
    const deferred = new Deferred<T[]>()
    const collected: T[] = new Array(ds.length)

    ds.forEach((d, i) => {
        pipe(d, (v) => {
            collected[i] = v
            if (--counter === 0)
                deferred.done(collected)
        })
    })
    return deferred
}

export function afterAll<T>(ds: Deferred<T>[], f: Fn0): Deferred<void> {
    let counter = ds.length
    const deferred = then(new Deferred<void>(), f)

    ds.forEach((d) => {
        pipe(d, () => {
            if (--counter === 0)
                deferred.done()
        })
    })

    return deferred
}

export function pipe<T>(d: Deferred<T>, f: Work<T>): void {
    if (d.isDone)
        f(d.result!)
    else
        d.then = combineWork(d.then, f)
}

function combineWork<T>(a: Work<T>, b: Work<T>): Work<T> {
    return (a === noop) ? b : (v: T) => {
        a(v)
        b(v)
    }
}