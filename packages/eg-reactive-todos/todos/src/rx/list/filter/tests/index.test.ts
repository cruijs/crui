import { filter } from '..';
import { StreamList, Update } from '../../index';
import { Predicate } from '../types';

let list: StreamList<number>
let filtered: StreamList<number>
let upd: Update<number>|undefined

const isEven: Predicate<number> = (n) => n % 2 === 0
function setup(xs: number[], p = isEven) {
    upd = undefined
    list = new StreamList(xs)
    const res = filter(list, p)
    filtered = res.list
    filtered.subscribe((u) => upd = u)
    return list
}


describe('filter', () => {
    it('correctly filter list', () => {
        const list = new StreamList([1, 2, 3, 4, 5, 6])
        const { list: filtered } = filter(list, isEven)
        expect(filtered.get()).toEqual([2, 4, 6])
    })
    describe('Replace source list', () => {
        beforeAll(() => {
            setup([1, 2, 3, 4, 5, 6])
                .replace([1, 9, 12])
        })

        it('replace filtered too', () => {
            expect(filtered.get()).toEqual([12])
        })

        it('notify listeners', () => {
            expect(upd).toEqual({
                type: 'replace',
                oldList: [2, 4, 6],
                newList: [12]
            })
        })
    })

    describe('Set element in source list', () => {
        describe('when present in filtered list', () => {
            describe('and value matches the predicate', () => {
                beforeAll(() => {
                    setup([1, 2, 3, 4, 5, 6]).update(1, 4)
                })

                it('update it', () => {
                    expect(list.get()).toEqual([1, 4, 3, 4, 5, 6])
                    expect(filtered.get()).toEqual([4, 4, 6])
                })

                it('notify listeners', () => {
                    expect(upd).toEqual({
                        type: 'update',
                        index: 0,
                        oldValue: 2,
                        newValue: 4,
                    })
                })
            })
            describe('but value doesn\'t match predicate', () => {
                beforeAll(() => {
                    setup([1, 2, 3, 4, 5, 6]).update(1, 1)
                })

                it('removes the element', () => {
                    expect(filtered.get()).toEqual([4, 6])
                })

                it('notify listeners', () => {
                    expect(upd).toEqual({
                        type: 'splice',
                        index: 0,
                        removed: [2],
                        added: [],
                    })
                })
            })
        })

        describe('when not present in filtered list', () => {
            const lt3: Predicate<number> = (n) => n < 3

            describe('and does not match predicate', () => {
                beforeAll(() => {
                    setup([1, 2, 3], lt3).update(2, 5)
                })

                it('do nothing', () => {
                    expect(filtered.get()).toEqual([1, 2])
                    expect(upd).toBeUndefined()
                })
            })

            describe('but new value match predicate', () => {
                describe('add it in correct position', () => {
                    beforeEach(() => {
                        setup([3, 2, 3, 2, 1, 3], lt3)
                    })

                    it('insert at the head', () => {
                        list.update(0, 1)
                        expect(filtered.get()).toEqual([1, 2, 2, 1])
                    })

                    it('insert in the middle', () => {
                        list.update(2, 0)
                        expect(filtered.get()).toEqual([2, 0, 2, 1])
                    })

                    it('insert at the end', () => {
                        list.update(5, 0)
                        expect(filtered.get()).toEqual([2, 2, 1, 0])
                    })
                })

                it('notify listeners', () => {
                    setup([1, 2, 3, 5, 6]).update(2, 0)

                    expect(upd).toEqual({
                        type: 'splice',
                        index: 1,
                        removed: [],
                        added: [0]
                    })
                })
            })
        })
    })

    describe('Splice source list', () => {
        describe('remove elements', () => {
            describe('not in filtered', () => {
                beforeAll(() => {
                    setup([1, 2, 3, 4], (n) => n === 1)
                        .splice(1, 3, [])
                })

                it('does nothing', () => {
                    expect(filtered.get()).toEqual([1])
                    expect(upd).toBeUndefined()
                })
            })

            describe('only one matches', () => {
                beforeAll(() => {
                    setup([1, 2, 3, 1, 4])
                        .splice(1, 3, [])
                })

                it('remove the one that matches', () => {
                    expect(filtered.get()).toEqual([4])
                })
                it('notify listeners', () => {
                    expect(upd).toEqual({
                        type: 'splice',
                        index: 0,
                        removed: [2],
                        added: []
                    })
                })
            })

            describe('multiple matches', () => {
                beforeAll(() => {
                    setup([0, 2, 3, 4, 6]).splice(1, 3, [])
                })

                it('remove those that matches', () => {
                    expect(filtered.get()).toEqual([0, 6])
                })
                it('notify listeners', () => {
                    expect(upd).toEqual({
                        type: 'splice',
                        index: 1,
                        removed: [2, 4],
                        added: []
                    })
                })
            })
        })

        describe('add elements', () => {
            describe('no matches', () => {
                it('does nothing', () => {
                    setup([]).splice(0, 0, [1, 3])
                    expect(filtered.get()).toEqual([])
                    expect(upd).toBeUndefined()
                })
            })

            describe('only one matches', () => {
                beforeAll(() => {
                    setup([1]).splice(1, 0, [2, 3])
                })

                it('adds the one that matches', () => {
                    expect(filtered.get()).toEqual([2])
                })
                it('notify listeners', () => {
                    expect(upd).toEqual({
                        type: 'splice',
                        index: 0,
                        removed: [],
                        added: [2]
                    })
                })
            })

            describe('multiple matches', () => {
                beforeAll(() => {
                    debugger
                    setup([1, 4, 5])
                        .splice(2, 0, [2, 3, 4])
                })

                it('adds those that matches', () => {
                    expect(filtered.get()).toEqual([4, 2, 4])
                })
                it('notify listeners', () => {
                    expect(upd).toEqual({
                        type: 'splice',
                        index: 1,
                        removed: [],
                        added: [2, 4]
                    })
                })
            })
        })
    })
})