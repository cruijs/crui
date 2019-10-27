import { AnyAction } from '../types';
import { schedule } from '../scheduler';

export function render<A extends AnyAction, D extends A['_drivers']>(
    node: Node,
    driver: D,
    action: A
): void {
    schedule(window.requestAnimationFrame, node, driver, action)
}