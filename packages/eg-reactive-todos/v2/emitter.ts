import { Deferred } from './deferred';
import { AnyAction } from './types';

export interface Emitter<N, A extends AnyAction = AnyAction> {
    emit(node: N, action: A): Deferred<A['_return']>
    emitAll(node: N, actions: readonly A[]): Deferred<A['_return'][]>
}