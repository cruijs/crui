import { h, hc, onClick, text } from '@crui/core';
import { css } from '@crui/css-emotion';
import { bindValue } from '@crui/reactive';
import { cloneRW } from '@crui/reactive/rx/box/clone';
import { TodoStore } from '../store';

export function AddTodo(store: TodoStore) {
    const inp = store.getInput()
    return hc('div', [
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
        ], [
            text('Add')
        ])
    ])
}