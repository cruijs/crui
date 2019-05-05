import { Stream } from '../rx/stream';
import { Component } from '@crui/core/dom'
import { defCleanup } from '@crui/core/elems/rendered'

export function t$(s: Stream<string>): Component {
    return (dom) => {
        const node = dom.createText(s.get())
        const unsub = s.subscribe((val) => {
            node.textContent = val
        })
        return {
            node,
            unsub,
            beforeUnmount: defCleanup.beforeUnmount,
        }
    }
}