import { Tag, TagR } from '../../restrictions/tag'
import { Action, Driver } from '../../types'
import { action } from '../action'

export type EventHandler = EventListener
export type MouseHandler = (ev: MouseEvent) => void
export type KeyboardHandler = (ev: KeyboardEvent) => void

export type InputType = 'input' | 'change' | 'select'
export type KeyboardType = 'keyup' | 'keydown' | 'keypress'
export type FocusType = 'focus' | 'blur'
export type FormType = 'submit'
export type LoadType = 'load' | 'error' | 'abort'
export type MouseType = 'click' | 'mousemove' | 'mousedown' | 'mouseup' | 'mouseenter' | 'mouseleave' | 'mouseout' | 'mouseover'
export type EventType = InputType | FormType | LoadType | MouseType | KeyboardType

export type InputTag = 'textarea' | 'input' | 'select'
export type LoadTag = 'img' | 'script'

export const EventType = Symbol('event')
export type EventDriver<N = any> = {
    [EventType]: Driver<N, EventAction>
}
export type EventAction<T extends Tag = Tag> = Action<typeof EventType, EventDriver, TagR<T>> & {
    event: string,
    handler: EventHandler,
}

export function on<T extends InputTag>(ev: InputType, handler: EventHandler): EventAction<T>
export function on<T extends InputTag>(ev: KeyboardType, handler: KeyboardHandler): EventAction<T>
export function on<T extends LoadTag>(ev: LoadType, handler: EventHandler): EventAction<T> 
export function on(ev: FormType, handler: EventHandler): EventAction<'form'>
export function on<T extends Tag>(ev: MouseType, handler: MouseHandler): EventAction<T> 
export function on<T extends Tag>(ev: FocusType, handler: EventHandler): EventAction<T> 
export function on<E extends EventType>(event: E, handler: EventHandler):  EventAction
export function on<E extends EventType>(event: E, handler: (ev: any) => void):  EventAction {
    return action({
        type: EventType,
        event,
        handler,
    })
}

export function onClick<T extends Tag>(handler: MouseHandler): EventAction<T> {
    return on('click', handler)
}