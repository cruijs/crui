import { noop } from '../../core/utils/noop'

type Work<T> = (v: T) => void
export class Deferred<T> {
    then: Work<T> = noop

    done(v: T): void {
        this.then(v)
    }
}

export function then<T>(d: Deferred<T>, w: Work<T>): Deferred<T> {
    d.then = w
    return d
}

export function dependsOn<T>(master: Deferred<T>, slave: Readonly<Deferred<T>>): void {
    master.then = combineWork(master.then, (v) => {
        slave.done(v)
    })
}

function combineWork<T>(a: Work<T>, b: Work<T>): Work<T> {
    return (a === noop) ? b : (v: T) => {
        a(v)
        b(v)
    }
}