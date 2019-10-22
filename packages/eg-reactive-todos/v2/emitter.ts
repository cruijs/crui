import { Deferred, joinAll } from './deferred'
import { AnyAction, Drivers } from './types'

export type Job<N, A extends AnyAction = AnyAction, D extends A['_drivers'] = A['_drivers']> = {
    emitter: Emitter<N, A, D>,
    drivers: D,
    node: N,
    action: A,
    deferred: Deferred<A['_return']>
}

export type Emit<N> =
    <A extends AnyAction, D extends A['_drivers']>(
        job: Job<N, A, D>
    ) => void

export class Emitter<N, A0 extends AnyAction = AnyAction, D0 extends Drivers<N> = Drivers<N>> {
    constructor(
        private drivers: D0,
        private readonly realEmit: Emit<N>,
    ) {}

    emit = <A extends A0>(node: N, action: A): Deferred<A['_return']> => {
        const deferred = new Deferred()
        this.realEmit({
            emitter: this, 
            drivers: this.drivers,
            node, 
            action,
            deferred
        })
        return deferred
    }

    emitAll = <A extends A0>(node: N, actions: readonly A[]): Deferred<readonly A['_return'][]> =>
        joinAll(actions.map((a) =>
            this.emit(node, a)
        ))

    withDrivers<D extends Drivers<N>>(
        f: (drivers: Readonly<D0>) => D
    ): Emitter<N, A0, D> {
        return new Emitter(f(this.drivers), this.realEmit)
    }
}