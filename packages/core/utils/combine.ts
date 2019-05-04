import { noop } from './noop';

type Fn0 = () => void 
export function combine(fs: Fn0[]): Fn0 {
    return () => {
        for(const f of fs)
            f()
    }
}

type AsyncFn0 = () => PromiseLike<void>
export function combineAsync(fs: AsyncFn0[]): AsyncFn0 {
    return () => (
        Promise.all(
            fs.map(f => f())
        ).then(noop)
    )
}

export function bindAsync(async: AsyncFn0, f: Fn0 | AsyncFn0): AsyncFn0 {
    return () => async().then(f)
}

export function bindAsync2(async: AsyncFn0, a: Fn0 | AsyncFn0, b: Fn0 | AsyncFn0): AsyncFn0 {
    return () => async().then(a).then(b)
}

export function runAll(fs: Fn0[]): void {
    fs.forEach((f) => f())
}