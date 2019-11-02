import { mount, MountDriver } from '../actions/mount';
import { schedule } from '../scheduler';
import { AnyNodeAction } from '../types';

export function render<A extends AnyNodeAction, D extends A['_drivers'] & MountDriver<Node>>(
    node: Node,
    driver: D,
    action: A
): void {
    schedule(window.requestAnimationFrame, node, driver, mount(action))
}