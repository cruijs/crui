import { Replace, StreamList, UpdateType } from '../../index';
import { handleReplace } from '../handleReplace';
import { Predicate } from '../types';

const isEven: Predicate<number> = (n) => n % 2 === 0

describe(handleReplace, () => {
    it('replace & filter again', () => {
        const upd: Replace<number> = {
            type: UpdateType.Replace,
            oldList: [1, 6],
            newList: [1, 2, 3, 4],
        }
        const $nl = new StreamList([6])
        const actual = handleReplace(upd, {
            $nl,
            p: isEven,
            indexMap: [null, 0]
        })
        expect($nl.get()).toEqual([2, 4])
        expect(actual).toEqual([null, 0, null, 1])
    })
})