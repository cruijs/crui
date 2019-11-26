type Work<T> = (v: T) => void

export class Deferred<T> {
    result?: T
    then: Work<T>[] = []
    isDone: Boolean = false

    done(v: T): void {
        this.result = v
        this.isDone = true

        this.then.forEach((f) => f(v))
        this.then = []
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
        d.then.push(f)
}

export function then<T>(d: Deferred<T>, f: Work<T>): Deferred<T> {
    pipe(d, f)
    return d
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

/**
 * Execute the second action, but ignore it's return value
 */
export function bind_<A>(d: Readonly<Deferred<A>>, f: (a: A) => Deferred<any>): Deferred<A> {
    return bind(d, (a) => constMap(a, f(a)))
}

export function waitAll(ds: readonly Readonly<Deferred<any>>[]): Deferred<void> {
    let counter = ds.length
    
    if (counter === 0)
        return completed<void>(undefined)

    const deferred = new Deferred<void>()
    ds.forEach((d) => {
        pipe(d, () => {
            if (--counter === 0)
                deferred.done()
        })
    })

    return deferred
}

export function joinAll<A, B>(ds: readonly [Deferred<A>, Deferred<B>]): Deferred<readonly [A, B]>
export function joinAll<A, B, C>(ds: readonly [Deferred<A>, Deferred<B>, Deferred<C>]): Deferred<readonly [A, B, C]>
export function joinAll<A, B, C, D>(ds: readonly [Deferred<A>, Deferred<B>, Deferred<C>, Deferred<D>]): Deferred<readonly [A, B, C, D]>
export function joinAll<T>(ds: readonly Readonly<Deferred<T>>[]): Deferred<readonly T[]>
export function joinAll(ds: readonly Deferred<any>[]): Deferred<any> {
    let counter = ds.length
    const deferred = new Deferred<readonly any[]>()
    const collected: any[] = new Array(ds.length)

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