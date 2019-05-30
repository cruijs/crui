import { Component } from '@crui/core/dom';
import { modRendered } from '@crui/core/elems/rendered';
import { Stream } from '../rx/stream';

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