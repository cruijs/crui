import { opsApply } from '../../../operations/apply';
import { opAdd, opRemove, opReplace, opSplice } from '../../../operations/factory';
import { StreamList } from '../../../stream';
import { Update } from '../../../types';
import { diff } from '..';

function assert(source: number[], target: number[], expected: Update<number>[]) {
    const $list = new StreamList(source)

    expect(diff(
        $list.get(),
        target,
    )).toEqual(expected)

    opsApply($list, expected)
    expect($list.get()).toEqual(target)
}

describe(diff, () => {
    describe('with empty lists', () => {
        it('no updates', () => {
            expect(diff([], [])).toEqual([])
        })
    })

    describe('same list', () => {
        it('no updates', () => {
            expect(diff(
                [1, 2, 3],
                [1, 2, 3]
            )).toEqual([])
        })
    })

    describe('all elements are different', () => {
        it('replace all', () => {
            assert([1], [2], [
                opReplace([1], [2])
            ])
        })
    })

    describe('fragmented', () => {
        describe('removal', () => {
            it('fragmented updates', () => {
                assert(
                    [0, 1, 2, 3, 4, 5],
                    [0, 2, 4],
                    [
                        opRemove(1, [1]),
                        opRemove(2, [3]),
                        opRemove(3, [5]),
                    ]
                )
            })
        })

        describe('addition', () => {
            it('fragmented updates', () => {
                assert(
                    [0, 2, 4],
                    [0, 1, 2, 3, 4, 5],
                    [
                        opAdd(1, [1]),
                        opAdd(3, [3]),
                        opAdd(5, [5]),
                    ]
                )
            })
        })
    })

    describe('least amount of operations', () => {
        it('squash subsequent one', () => {
            assert(
                [0, 1, 2, 3, 4],
                [0, 5, 6, 3, 4, 7, 8],
                [
                    opSplice(1, [1, 2], [5, 6]),
                    opAdd(5, [7, 8]),
                ]
            )
        })
    })
})