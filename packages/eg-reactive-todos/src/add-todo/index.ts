import { onClick } from '@crui/core/combinators/events';
import { hc } from '@crui/core/elems/children';
import { text } from '@crui/core/elems/text';
import { hss } from '@crui/css-emotion';
import { $bindVal } from '@crui/reactive/combinators/$bind';
import { cloneRW } from '@crui/reactive/rx/box/clone';
import { hcs } from '../../../css-emotion/elems/hcs';
import { TodoStore } from '../store';

const input = hss('input', {
    width: '13rem'
})
const submit = hcs('button', { marginLeft: '0.5rem' }, [
    text('Add')
])
export function AddTodo(store: TodoStore) {
    const inp = store.getInput()
    return hc('div', [
        $bindVal(input, cloneRW(inp)),
        onClick(submit, (e) => {
            e.preventDefault()

            store.addTodo(inp.get())
            inp.set('')
        })
    ])
}