import { StreamList } from '../../../stream';
import { Splice, UpdateType } from '../../../types';
import { Index, Predicate } from '../../types';
import { handleSplice } from '../handleSplice';

function splice(index: number, removed: number[], added: number[]): Splice<number> {
    return {
        type: UpdateType.Splice,
        index,
        removed,
        added,
    }
}
function remove(index: number, removed: number[]) {
    return splice(index, removed, [])
}
function added(index: number, added: number[]) {
    return splice(index, [], added)
}

const isEven: Predicate<number> = (n) => n % 2 === 0
function run(
    state: {
        upd: Splice<number>,
        list: number[],
        imap: Index,
    },
    expected: {
        list: number[],
        imap: Index,
    }
) {
    const $nl = new StreamList(state.list)
    const actual = handleSplice({
        $list: $nl,
        p: isEven,
        indexMap: state.imap
    }, state.upd)
    expect($nl.get()).toEqual(expected.list)
    expect(actual).toEqual(expected.imap)
}

describe(handleSplice, () => {
    describe('remove items', () => {
        describe('from the head', () => {
            describe('no matches', () => {
                it('trim indexMap', () => {
                    const list = [2]
                    run({
                        upd: remove(1, [1, 3]),
                        list,
                        imap: [undefined, undefined, undefined, 0],
                    }, {
                        list,
                        imap: [undefined, 0]
                    })
                })
            })

            describe('single item', () => {
                it('clear the list', () => {
                    run({
                        upd: remove(0, [2]),
                        list: [0],
                        imap: [0],
                    }, {
                        list: [],
                        imap: [],
                    })
                })
            })

            describe('full match', () => {
                it('remove all of them', () => {
                    run({
                        upd: remove(0, [2, 4]),
                        list: [2, 4, 6],
                        imap: [0, 1, undefined, 2],
                    }, {
                        list: [6],
                        imap: [undefined, 0]
                    })
                })
            })

            describe('partial match', () => {
                it('remove all matches', () => {
                    run({
                        list: [2, 4, 6, 8],
                        imap: [0, undefined, 1, undefined, 2, 3],
                        upd: remove(0, [2, 3]),
                    }, {
                        list: [4, 6, 8],
                        imap: [0, undefined, 1, 2],
                    })
                })
            })
        })

        describe('from the middle', () => {
            describe('no matches', () => {
                it('trim indexMap', () => {
                    const list = [2]
                    run({
                        upd: remove(2, [1, 3]),
                        list,
                        imap: [undefined, 0, undefined, undefined, undefined],
                    }, {
                        list,
                        imap: [undefined, 0, undefined]
                    })
                })
            })

            describe('full match', () => {
                it('remove all of them', () => {
                    run({
                        upd: remove(1, [2, 4]),
                        list: [0, 2, 4, 6],
                        imap: [0, 1, 2, 3],
                    }, {
                        list: [0, 6],
                        imap: [0, 1]
                    })
                })
            })

            describe('partial match', () => {
                it('remove all matches', () => {
                    run({
                        list: [2, 4, 6, 8],
                        imap: [0, undefined, undefined, 1, undefined, 2, 3],
                        upd: remove(2, [3, 4, 5, 6]),
                    }, {
                        list: [2, 8],
                        imap: [0, undefined, 1],
                    })
                })
            })
        })

        describe('from the end', () => {
            describe('no matches', () => {
                it('trim indexMap', () => {
                    const list = [2]
                    run({
                        upd: remove(1, [1, 3]),
                        list,
                        imap: [0, undefined, undefined],
                    }, {
                        list,
                        imap: [0]
                    })
                })
            })

            describe('full match', () => {
                it('remove all of them', () => {
                    run({
                        upd: remove(2, [2, 4]),
                        list: [0, 2, 4, 6],
                        imap: [0, 1, 2, 3],
                    }, {
                        list: [0, 2],
                        imap: [0, 1]
                    })
                })
            })

            describe('partial match', () => {
                it('remove all matches', () => {
                    run({
                        list: [2, 4, 8],
                        imap: [0, 1, undefined, undefined, 2],
                        upd: remove(3, [3, 8]),
                    }, {
                        list: [2, 4],
                        imap: [0, 1, undefined],
                    })
                })
            })
        })
    })

    describe('add items', () => {
        describe('from the head', () => {
            describe('no matches', () => {
                it('update indexMap', () => {
                    const list = [2]
                    run({
                        upd: added(0, [1, 3]),
                        list,
                        imap: [0],
                    }, {
                        list,
                        imap: [undefined, undefined, 0]
                    })
                })
            })

            describe('full match', () => {
                it('add all of them', () => {
                    run({
                        upd: added(0, [2, 4]),
                        list: [6],
                        imap: [0, undefined],
                    }, {
                        list: [2, 4, 6],
                        imap: [0, 1, 2, undefined]
                    })
                })
            })

            describe('partial match', () => {
                it('add all matches', () => {
                    run({
                        list: [4, 6],
                        imap: [0, undefined, 1, undefined],
                        upd: added(0, [0, 1, 2]),
                    }, {
                        list: [0, 2, 4, 6],
                        imap: [0, undefined, 1, 2, undefined, 3, undefined],
                    })
                })
            })
        })

        describe('from the middle', () => {
            describe('no matches', () => {
                it('fill indexMap', () => {
                    const list = [2]
                    run({
                        upd: added(2, [1, 3]),
                        list,
                        imap: [undefined, 0, undefined],
                    }, {
                        list,
                        imap: [undefined, 0, undefined, undefined, undefined]
                    })
                })
            })

            describe('full match', () => {
                it('add all of them', () => {
                    run({
                        upd: added(1, [2, 4]),
                        list: [0, 6],
                        imap: [0, 1],
                    }, {
                        list: [0, 2, 4, 6],
                        imap: [0, 1, 2, 3],
                    })
                })
            })

            describe('partial match', () => {
                it('add all matches', () => {
                    run({
                        list: [2, 8],
                        imap: [0, undefined, 1],
                        upd: added(2, [3, 4, 5, 6]),
                    }, {
                        list: [2, 4, 6, 8],
                        imap: [0, undefined, undefined, 1, undefined, 2, 3],
                    })
                })
            })
        })

        describe('from the end', () => {
            describe('no matches', () => {
                it('fill indexMap', () => {
                    const list = [2]
                    run({
                        list,
                        imap: [0],
                        upd: added(2, [1, 3]),
                    }, {
                        list,
                        imap: [0, undefined, undefined],
                    })
                })
            })

            describe('full match', () => {
                it('add all of them', () => {
                    run({
                        list: [0, 2],
                        imap: [0, 1],
                        upd: added(2, [4, 6]),
                    }, {
                        list: [0, 2, 4, 6],
                        imap: [0, 1, 2, 3],
                    })
                })
            })

            describe('partial match', () => {
                it('add all matches', () => {
                    run({
                        list: [2, 4],
                        imap: [0, 1, undefined],
                        upd: added(3, [3, 8]),
                    }, {
                        list: [2, 4, 8],
                        imap: [0, 1, undefined, undefined, 2],
                    })
                })
            })
        })

        describe('index over the end', () => {
            it('appends at the end', () => {
                run({
                    list: [2],
                    imap: [0],
                    upd: added(1, [3, 4])
                }, {
                    list: [2, 4],
                    imap: [0, undefined, 1],
                })
            })
        })
    })

    describe('add & remove', () => {
        describe('emtpy list', () => {
            it('handles it', () => {
                run({
                    list: [],
                    imap: [undefined],
                    upd: splice(0, [1], [2, 4]),
                }, {
                    list: [2, 4],
                    imap: [0, 1],
                })
            })
        })

        describe('head', () => {
            it('handles it', () => {
                run({
                    list: [2, 4],
                    imap: [undefined, 0, 1],
                    upd: splice(0, [1], [0]),
                }, {
                    list: [0, 2, 4],
                    imap: [0, 1, 2],
                })
            })
        })

        describe('middle', () => {
            it('handles it', () => {
                run({
                    list: [2, 4],
                    imap: [0, undefined, 1],
                    upd: splice(1, [3, 4], [5, 6]),
                }, {
                    list: [2, 6],
                    imap: [0, undefined, 1],
                })
            })
        })

        describe('tail', () => {
            it('handles it', () => {
                run({
                    list: [2, 4],
                    imap: [undefined, 0, 1],
                    upd: splice(2, [4, 5], [0]),
                }, {
                    list: [2, 0],
                    imap: [undefined, 0, 1],
                })
            })
        })
    })
})