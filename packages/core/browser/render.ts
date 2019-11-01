import { schedule } from '../scheduler';
import { Action } from '../types';

export function render<A extends Action, D extends A['_drivers']>(
    node: Node,
    driver: D,
    action: A
): void {
    schedule(window.requestAnimationFrame, node, driver, action)
}