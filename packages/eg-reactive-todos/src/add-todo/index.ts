import { hc } from '@crui/core/elems/children';
import { h } from '@crui/core/elems/h';
import { text } from '@crui/core/elems/text';
import { children } from '@crui/core/setups/children';
import { onClick } from '@crui/core/setups/events';
import { css } from '@crui/css-emotion/setups/css';
import { cloneRW } from '@crui/reactive/rx/box/clone';
import { bindVal } from '@crui/reactive/setups/bind';
import { TodoStore } from '../store';

export function AddTodo(store: TodoStore) {
    const inp = store.getInput()
    return hc('div', [
        h('input', [
            bindVal(cloneRW(inp)),
            css({ width: '13rem' }),
        ]),
        h('button', [
            css({ marginLeft: '0.5rem' }),
            onClick((e) => {
                e.preventDefault()

                store.addTodo(inp.get())
                inp.set('')
            }),
            children([
                text('Add')
            ])
        ])
    ])
}