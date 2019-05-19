import { Predicate$ } from '../$filter$';
import { $filter$$, $Predicate$ } from '../$filter$$';
import { StreamBox } from '../../../box/index';
import { StreamList } from '../../index';
import { noop } from '@crui/core/utils/noop';
import { Stream } from '../../../stream';

const $l = <T>(list: T[]) => new StreamList(list.map($i))
const $i = <T>(val: T) => ({ value: new StreamBox(val) })
const $p$ = <T>(p$: Predicate$<StreamBox<T>>) => new StreamBox(p$)
type Item<T> = { value: StreamBox<T> }

function expectValues<T>(list: StreamList<Item<T>>, expected: T[]) {
    expect(list.map((v) => v.value.get())).toEqual(expected)
}

function assertCleanup(target: Stream<any>, trigger: Stream<any>): void {
    target.subscribe(noop)
    expectListeners(target).toBeGreaterThan(0)
    trigger.destroy()
    expectListeners(target).toBe(1)
}

function expectListeners(s: Stream<any>) {
    return expect(listeners(s))
}

function listeners(s: Stream<any>): number {
    return (s as any).listeners.length
}

describe($filter$$, () => {
    describe('filter based on predicate stream', () => {
        let list: StreamList<Item<number>>
        let pred: $Predicate$<StreamBox<number>>
        let ftrd: StreamList<Item<number>>

        beforeEach(() => {
            list = $l([1, 10, 2])
            pred = $p$((v) => v.map((n) => n < 10))
            ftrd = $filter$$(list, pred, (p) => (i) => p(i.value))
        })

        afterEach(() => {
            list.destroy()
            pred.destroy()
            ftrd.destroy()
        })

        describe('change source list', () => {
            it('updates filtered', () => {
                list.push($i(10))
                expectValues(ftrd, [1, 2])

                list.push($i(9))
                expectValues(ftrd, [1, 2, 9])
            })
        })

        describe('change item value', () => {
            it('updates filtered', () => {
                list.item(0)!.value.set(11)
                expectValues(ftrd, [2])

                list.item(1)!.value.set(9)
                expectValues(ftrd, [9, 2])
            })
        })

        describe('change predicate', () => {
            beforeEach(() => {
                pred.set((s) => s.map((n) => n >= 10))
            })

            it('updates filtered', () => {
                expectValues(ftrd, [10])
            })

            describe('change item', () => {
                it('updates filtered', () => {
                    list.item(0)!.value.set(11)
                    expectValues(ftrd, [11, 10])

                    list.item(0)!.value.set(9)
                    expectValues(ftrd, [10])
                })
            })

            describe('change list', () => {
                it('updates filtered', () => {
                    list.push($i(11))
                    expectValues(ftrd, [10, 11])

                    list.push($i(9))
                    expectValues(ftrd, [10, 11])
                })
            })
        })
    })

    describe('cleanup', () => {
        let list: StreamList<Item<boolean>>
        let pred: $Predicate$<StreamBox<boolean>>
        let ftrd: StreamList<Item<boolean>>

        beforeEach(() => {
            list = $l([true, false])
            pred = $p$((v) => v)
            ftrd = $filter$$(list, pred, (p) => (i) => p(i.value))
        })

        afterEach(() => {
            list.destroy()
            pred.destroy()
            ftrd.destroy()
        })

        describe('on destroy', () => {
            it('cleanup list', () => {
                assertCleanup(list, ftrd)
            })

            it('cleanup pred', () => {
                assertCleanup(pred, ftrd)
            })

            it('destroy items', () => {
                let count = 0
                list.forEach((v) => {
                    v.value.subscribe(() => ++count)
                })

                ftrd.destroy()

                list.forEach((v) => {
                    v.value.set(false)
                })
                expect(count).toBe(0)
            })
        })

        describe('on predicate change', () => {
            it('cleanup items', () => {
                const count = list.map((v) => listeners(v.value))

                pred.set((v) => v)

                expect(
                    list.map((v) => listeners(v.value))
                ).toEqual(count)
            })
        })
    })
})