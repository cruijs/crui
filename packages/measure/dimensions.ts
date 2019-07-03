import { keys } from '@crui/core/utils/object';
import { DRW$B, R$B, W$B } from '@crui/reactive/rx';
import { StreamBox } from '@crui/reactive/rx/box';
import { Destroyable } from '@crui/reactive/rx/types';

type Dimensions<N> = {
    top: N,
    left: N,
    width: N,
    height: N,
}

export type RDim = Dimensions<R$B<number>>
export type WDim = Dimensions<W$B<number>>
export type RWDim = Dimensions<DRW$B<number>>
export type DDim = Dimensions<Destroyable>

export function makeDim(): RWDim {
    return {
        top: new StreamBox(0),
        left: new StreamBox(0),
        width: new StreamBox(0),
        height: new StreamBox(0),
    }
}

export function destroyDim(dim: DDim): void {
    keys(dim).forEach((k) => dim[k].destroy())
}