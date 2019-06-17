import { Component } from '@crui/core/dom';
import { modLifecycle } from '@crui/core/dom/rendered';
import { combine, Fn0 } from '@crui/core/utils/combine';
import { WithSuspense } from '../context';

export function image(src: string): Component<WithSuspense> {
    return (dom, { waitFor }) => {
        const node = dom.create('img')
        dom.setProp(node, 'src', src)

        let resolve: Fn0, reject: Fn0
        const p = new Promise((rs, rj) => {
            resolve = rs
            reject = rj
        })
        waitFor(p)

        return modLifecycle(node, (r) => {
            r.unsub = combine([
                dom.listen(node, 'load', resolve),
                dom.listen(node, 'error', reject),
                dom.listen(node, 'abort', reject),
            ])
        })
    }
}