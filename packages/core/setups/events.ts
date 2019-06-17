import { Setup, Tag } from '../dom';
import { Meta, modLifecycle, result } from '../dom/rendered';

export type EventHandler = EventListener
export type MouseHandler = (ev: MouseEvent) => void

export type InputType = 'input' | 'change' | 'select' | 'focus' | 'blur'
export type FormType = 'submit'
export type LoadType = 'load' | 'error' | 'abort'
export type MouseType = 'click' | 'mousemove' | 'mousedown' | 'mouseup' | 'mouseenter' | 'mouseleave' | 'mouseout' | 'mouseover'
export type EventType = InputType | FormType | LoadType | MouseType

export type InputTag = 'textarea' | 'input' | 'select'
export type LoadTag = 'img' | 'script'


/**
 * Setup an event handler
 */
export function on<T extends InputTag>(ev: InputType, handler: EventListener): Setup<{}, Meta<T>>
export function on<T extends LoadTag>(ev: LoadType, handler: EventListener): Setup<{}, Meta<T>>
export function on(ev: FormType, handler: EventListener): Setup<{}, Meta<'form'>>
export function on<T extends Tag>(ev: MouseType, handler: MouseHandler): Setup<{}, Meta<T>>
export function on<E extends EventType>(ev: E, handler: (ev: any) => void): Setup<{}, Meta<any>> {
    return (meta, dom, node) => result(meta, modLifecycle((m) => {
        m.unsub = dom.listen(node, ev, handler)
    }))
}

/**
 * Setup a `click` event handler
 */
export function onClick<T extends Tag>(handler: MouseHandler): Setup<{}, Meta<T>> {
    return on('click', handler)
}