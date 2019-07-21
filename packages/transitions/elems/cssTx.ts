import { DOM } from '@crui/core/dom';
import { KS, PS } from '@crui/core/dom/style';
import { combine } from '@crui/core/utils/combine';
import { noop } from '@crui/core/utils/noop';
import { keys } from '@crui/core/utils/object';
import { tx } from './tx';

type Milliseconds<T> = {[K in keyof T]: number}

/**
 * Create a CSS Transition to apply to a Component
 */
export const cssTx = <K extends KS>(
    transitions: Milliseconds<PS<K>>,
    fromStyle: PS<K>, 
    toStyle: PS<K>
) => tx((node, dom) => {
    const props = keys(transitions)

    dom.applyStyle(node, fromStyle)
    dom.modStyle(node, (s) => {
        let trans = props
            .map((k) => `${k} ${transitions[k]}ms`)
            .join(',')
        if (s.transition) {
            trans = s.transition + ', ' + trans
        }
        s.transition = trans
    })

    const slowest = props.reduce(
        (z, k) => transitions[k] > transitions[z] ? k : z,
        props[0]
    )

    return {
        intro: onTrans(dom, node, toStyle, slowest),
        outro: onTrans(dom, node, fromStyle, slowest)
    }
})

export const onTrans = <N, K extends KS>(
    dom: DOM<N>,
    node: N,
    style: PS<K>,
    slowest: string,
) => {
    let done = noop
    let unsub = noop
    const cancel = () => {
        unsub()
        done()
        done = unsub = noop
    }
    const run = () => {
        const handler = (e: Event) => {
            if (!(e instanceof TransitionEvent))
                return

            if (e.propertyName !== slowest)
                return

            cancel()
        }
        /**
         * When clicking around, it's possible for long transitions to not trigger
         * because property are already set to target value, so this hack ensures 
         * that this edge case is handled.
         */
        const timeout = setTimeout(cancel, 100)
        const once = dom.listen(node, 'transitionrun', () => {
            if (timeout) clearTimeout(timeout)
            once()
        })
        unsub = combine([
            () => { if (timeout) clearTimeout(timeout) },
            dom.listen(node, 'transitionend', handler),
            once
        ])
        return new Promise<void>((resolve) => {
            dom.applyStyle(node, style)
            done = resolve
        })
    }
    return { run, cancel }
}