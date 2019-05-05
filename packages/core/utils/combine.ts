import { noop, asyncNoop } from './noop'

type Fn0 = () => void 
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

type AsyncFn0 = () => PromiseLike<void>
const logError = (e: Error) => console.error(e)
export function combineAsync(fs: AsyncFn0[]): AsyncFn0 {
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

export function runAll(fs: Fn0[]): void {
    fs.forEach((f) => f())
}