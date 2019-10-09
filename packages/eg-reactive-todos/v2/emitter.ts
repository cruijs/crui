import { Deferred } from './deferred';
import { AnyAction } from './types';

export interface Emitter<N, A extends AnyAction> {
    emit(node: N, action: A): Deferred<N>
    emitAll(node: N, actions: readonly A[]): Deferred<N[]>
}