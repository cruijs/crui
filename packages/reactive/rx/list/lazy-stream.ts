import { AbstractStreamList } from './abstract-stream'
import { opBatch } from './operations/factory'
import { Lazy, Update } from './types'

export class LazyStreamList<T> extends AbstractStreamList<T> implements Lazy {
    private updates: Update<T>[] = []

    protected updated(upd: Update<T>): void {
        this.updates.push(upd)
    }

    runNotify(): void {
        if (this.updates.length === 0)
            return

        const upds = this.updates
        this.updates = []

        if (upds.length === 1)
            this.notify(upds[0])
        else
            this.notify(opBatch(upds))
    }
}