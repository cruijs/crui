import { Deferred } from './deferred';
import { AnyAction } from './types';

export interface Emitter<N, A0 extends AnyAction = AnyAction> {
    emit<A extends A0>(node: N, action: A): Deferred<A['_return']>
    emitAll<A extends A0>(node: N, actions: readonly A[]): Deferred<A['_return'][]>
}