import { noop } from '../noop'

type Work<T> = (v: T) => void
export class Deferred<T> {
    result?: T
    then: Work<T> = noop
    isDone: Boolean = false

    done(v: T): void {
        this.result = v
        this.isDone = true

        this.then(v)
        this.then = noop
    }
}

export function completed<T>(result: T): Deferred<T> {
    const d = new Deferred<T>()
    d.done(result)
    return d
}

export function pipe<T>(d: Deferred<T>, f: Work<T>): void {
    if (d.isDone)
        f(d.result!)
    else
        d.then = combineWork(d.then, f)
}

export function dependsOn<T>(slave: Readonly<Deferred<T>>, master: Deferred<T>): void {
    pipe(master, (v) => {
        slave.done(v)
    })
}

export function map<A, B>(d: Readonly<Deferred<A>>, f: (a: A) => B): Deferred<B> {
    const z = new Deferred<B>()
    pipe(d, (a) => {
        z.done(f(a))
    })
    return z
}

export function constMap<K>(k: K, d: Readonly<Deferred<any>>): Deferred<K> {
    return map(d, () => k)
}

export function bind<A, B>(d: Readonly<Deferred<A>>, f: (a: A) => Deferred<B>): Deferred<B> {
    const z = new Deferred<B>()
    pipe(d, (a) => {
        dependsOn(z, f(a))
    })
    return z
}

export function waitAll<T>(ds: readonly Readonly<Deferred<T>>[]): Deferred<void> {
    let counter = ds.length
    const deferred = new Deferred<void>()
    
    if (counter === 0) {
        deferred.done()
    }

    ds.forEach((d) => {
        pipe(d, () => {
            if (--counter === 0)
                deferred.done()
        })
    })

    return deferred
}

export function joinAll<T>(ds: readonly Readonly<Deferred<T>>[]): Deferred<readonly T[]> {
    let counter = ds.length
    const deferred = new Deferred<readonly T[]>()
    const collected: T[] = new Array(ds.length)

    if (counter === 0) {
        deferred.done(collected)
    }

    ds.forEach((d, i) => {
        pipe(d, (v) => {
            collected[i] = v
            if (--counter === 0)
                deferred.done(collected)
        })
    })

    return deferred
}

function combineWork<T>(a: Work<T>, b: Work<T>): Work<T> {
    return (a === noop) ? b : (v: T) => {
        a(v)
        b(v)
    }
}