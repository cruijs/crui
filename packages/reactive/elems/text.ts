import { Component } from '@crui/core/dom';
import { modLifecycle, rendered } from '@crui/core/dom/rendered';
import { DR$B } from '../rx/box/types';

/**
 * Dynamic text element that will change as the Stream change
 */
export function text$(s: DR$B<string>): Component<{}, {}> {
    return (dom) => {
        const node = dom.createText(s.get())

        const lifecycle = modLifecycle((r) => {
            s.subscribe((val) => {
                node.textContent = val
            })
            r.unsub = s.destroy
        })

        return rendered(node, lifecycle, {})
    }
}