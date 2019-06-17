import { noop, asyncNoop } from './noop'
import { AsyncFn } from '../types'

export type Fn0 = () => void 
export function combine(fs: Fn0[]): Fn0 {
    if (fs.length === 0) {
        return noop
    }
    if (fs.length === 1) {
        return fs[0]
    }
    return () => {
        for(const f of fs)
            f()
    }
}

export function combine2(a: Fn0, b: Fn0): Fn0 {
    if (a === noop) {
        return b
    }
    if (b === noop) {
        return a
    }
    return () => {
        a()
        b()
    }
}

export function runAll(fs: Fn0[]): void {
    fs.forEach((f) => f())
}

const logError = (e: Error) => console.error(e)
export function combineAsync(fs: AsyncFn[]): AsyncFn {
    fs = fs.filter(
        (f) => f !== asyncNoop
    )

    if (fs.length === 0) {
        return asyncNoop
    }
    if (fs.length === 1) {
        return fs[0]
    }

    return () => (
        Promise
            .all(fs.map(f => f()))
            .then(noop, logError)
    )
}

export function asyncBind(a: AsyncFn, b: AsyncFn): AsyncFn {
    if (a === asyncNoop) {
        return b
    }
    if (b === asyncNoop) {
        return a
    }

    return () => a().then(b, (e) => {
        logError(e)
        return b()
    })
}