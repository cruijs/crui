import { noop } from '@crui/core/utils/noop';
import { WithSuspense } from './context';

export class Suspender implements WithSuspense {
    private promises: PromiseLike<any>[]

    constructor() {
        this.promises = []
    }

    waitFor = (p: PromiseLike<any>) => {
        this.promises.push(p)
    }

    waitAll(): PromiseLike<void> {
        return Promise.all(this.promises).then(noop)
    }

    nothingToWaitFor() {
        return this.promises.length === 0
    }
}