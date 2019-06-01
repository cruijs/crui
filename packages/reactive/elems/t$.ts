import { Component } from '@crui/core/dom';
import { modRendered } from '@crui/core/dom/rendered';
import { Stream } from '../rx/stream';

/**
 * Dynamic text element that will change as the Stream change
 */
export function t$(s: Stream<string>): Component {
    return (dom) => {
        const node = dom.createText(s.get())

        return modRendered(node, (r) => {
            r.unsub = s.subscribe((val) => {
                node.textContent = val
            })
        })
    }
}