import { noop } from '@crui/core/utils/noop';
import { Predicate$ } from '../$filter$';
import { $filter$$ } from '../$filter$$';
import { map } from '../../../box/map';
import { StreamBox } from '../../../box/stream';
import { Destroyable, DR$B, R$B, RW$B } from '../../../box/types';
import { StreamList } from '../../stream';
import { DR$L, R$L } from '../../types';

type Pred$<T> = RW$B<Predicate$<Item<T>>> & Destroyable
type Filtered<T> = DR$L<Item<T>>

type Item<T> = { value: StreamBox<T> }
const $l = <T>(list: T[]) => new StreamList(list.map($i))
const $i = <T>(val: T) => ({ value: new StreamBox(val) })
const $p$ = <T>(p: (value: T) => boolean) => new StreamBox(
    (item: Item<T>) => map(item.value, p)
)

function expectValues<T>(list: R$L<Item<T>>, expected: T[]) {
    expect(list.map((v) => v.value.get())).toEqual(expected)
}

function assertCleanup(target: DR$B<any>, trigger: DR$B<any>): void {
    target.subscribe(noop)
    expectListeners(target).toBeGreaterThan(0)
    trigger.destroy()
    expectListeners(target).toBe(1)
}

function expectListeners(s: R$B<any>) {
    return expect(listeners(s))
}

function listeners(s: R$B<any>): number {
    return (s as any).listeners.length
}


describe($filter$$, () => {
    describe('filter based on predicate stream', () => {
        let list: StreamList<Item<number>>
        let pred: Pred$<number>
        let ftrd: Filtered<number>

        beforeEach(() => {
            list = $l([1, 10, 2])
            pred = $p$((n) => n < 10)
            ftrd = $filter$$(list, pred)
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
                pred.set((s) => map(s.value, (n) => n >= 10))
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
        let pred: Pred$<boolean>
        let ftrd: Filtered<boolean>

        beforeEach(() => {
            list = $l([true, false])
            pred = $p$((v: boolean) => v)
            ftrd = $filter$$(list, pred)
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

                pred.set((i) => i.value)

                expect(
                    list.map((v) => listeners(v.value))
                ).toEqual(count)
            })
        })
    })
})