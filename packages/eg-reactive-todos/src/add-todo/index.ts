import { cloneRW } from '@crui/reactive/rx/box/clone';
import { bindValue } from '../../v2/actions/bind';
import { css } from '../../v2/actions/css';
import { h } from '../../v2/actions/elem';
import { onClick } from '../../v2/actions/event';
import { text } from '../../v2/actions/text';
import { TodoStore } from '../store';

export function AddTodo(store: TodoStore) {
    const inp = store.getInput()
    return h('div', [
        h('input', [
            bindValue(cloneRW(inp)),
            css({ width: '13rem' }),
        ]),
        h('button', [
            css({ marginLeft: '0.5rem' }),
            onClick((e) => {
                e.preventDefault()

                store.addTodo(inp.get())
                inp.set('')
            }),
            text('Add')
        ])
    ])
}