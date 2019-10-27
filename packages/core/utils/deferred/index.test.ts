import { dependsOn, waitAll } from '../deferred'
import { bind, constMap, Deferred, joinAll, map, pipe } from './index'

function removeRandom<T>(xs: T[]): T {
    const i = Math.round(Math.random() * xs.length)
    return xs.splice(i, 1)[0]
}

function randomise<T>(xs: T[]): T[] {
    return xs.sort(() => Math.random() - 0.5)
}

describe(Deferred, () => {
    describe(pipe, () => {
        it('runs code once done', () => {
            let expected = 0
            const d = new Deferred<number>()
            pipe(d, (value) => {
                expected = value
            })
            expect(expected).toBe(0)

            d.done(10)
            expect(expected).toBe(10)
        })

        it('runs code only once', () => {
            let expected = 0
            const d = new Deferred<number>()
            pipe(d, (value) => {
                expected += value
            })

            d.done(10)
            expect(expected).toBe(10)

            d.done(100)
            expect(expected).toBe(10)
        })

        describe('already done', () => {
            it('runs code immediately', () => {
                const d = new Deferred<number>()
                let expected = 0

                d.done(10)
                pipe(d, (value) => {
                    expected = value
                })

                expect(expected).toBe(10)
            })
        })
    })

    describe(dependsOn, () => {
        it('complete one after the other', () => {
            const master = new Deferred<number>()
            const slave = new Deferred<number>()
            dependsOn(slave, master)

            let expected = 0
            pipe(slave, (n) => expected = n)

            master.done(10)
            expect(expected).toBe(10)
        })
    })

    describe(map, () => {
        it('alters returned value', () => {
            let expected = 0
            const d = new Deferred<number>()
            const mapped = map(d, (n) => n * 10)

            pipe(mapped, (n) => expected = n)
            d.done(10)

            expect(expected).toBe(100)
        })
    })

    describe(constMap, () => {
        it('ignores result and always return a fixed one', () => {
            let expected = 0
            const d = new Deferred<void>()
            const mapped = constMap(10, d)
            pipe(mapped, (n) => expected = n)

            d.done()
            expect(expected).toBe(10)
        })
    })

    describe(bind, () => {
        it('binds deferred to returned one', () => {
            let expected = 0
            const d0 = new Deferred<string>()
            const d1 = new Deferred<number>()
            d1.done(10)

            const d3 = bind(d0, () => d1)
            pipe(d3, (n) => expected = n)
            expect(expected).toBe(0)

            d0.done('test')
            expect(expected).toBe(10)
        })
    })

    describe(waitAll, () => {
        it('completes once all the others are complete', () => {
            let expected = 0
            const ds = [1, 2, 3, 4].map(() => new Deferred<void>())
            pipe(waitAll(ds.slice()), () => expected = 10)

            const last = removeRandom(ds)
            ds.forEach((d) => d.done())
            expect(expected).toBe(0)

            last.done()
            expect(expected).toBe(10)
        })

        describe('empty set', () => {
            it('completes immediately', () => {
                let expected = 0
                pipe(waitAll([]), () => expected = 10)

                expect(expected).toBe(10)
            })
        })
    })

    describe(joinAll, () => {
        it('completes once all the others are complete', () => {
            let expected: readonly number[] = []
            const ds = [1, 2, 3, 4].map((v) => ({
                d: new Deferred<number>(),
                v, 
            }))
            pipe(
                joinAll(ds.map(({ d }) => d)),
                (ns) => expected = ns
            )

            // completition order has no effect on result
            randomise(ds).forEach(({ v, d }) => {
                d.done(v)
            })

            expect(expected).toEqual([1, 2, 3, 4])
        })

        describe('empty set', () => {
            it('completes immediately', () => {
                let expected: readonly unknown[] = [1, 2, 3]
                pipe(joinAll([]), (x) => expected = x)

                expect(expected).toEqual([])
            })
        })
    })
})