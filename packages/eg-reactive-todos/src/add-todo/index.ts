import { onClick } from '@crui/core/combinators/events';
import { hc } from '@crui/core/elems/children';
import { text } from '@crui/core/elems/text';
import { h, hss } from '@crui/css-emotion';
import { $bindVal } from '@crui/reactive/combinators/$bind';
import { clone } from '@crui/reactive/rx/box/clone';
import { TodoStore } from '../store';

const input = hss('input', {
    width: '13rem'
})
const submit = h('button', {
    css: {
        marginLeft: '0.5rem',
    },
    children: [
        text('Add')
    ],
})
export function AddTodo(store: TodoStore) {
    const inp = store.getInput()
    return hc('div', [
        $bindVal(input, clone(inp)),
        onClick(submit, (e) => {
            e.preventDefault()

            store.addTodo(inp.get())
            inp.set('')
        })
    ])
}