import { Component } from '@crui/core/dom';
import { hc } from '@crui/core/elems/children';
import { ht } from '@crui/core/elems/ht';
import { h, hss } from '@crui/css-emotion';
import { $bindCheck } from '@crui/reactive/combinators/$bind';
import { h$filter$$ } from '@crui/reactive/elems/filter/h$filter$$';
import { StreamBox } from '@crui/reactive/rx/box';
import { cssTx } from '@crui/transitions/cssTx';
import { Todo, TodoStore } from '../store';

export function TodoList(store: TodoStore) {
    return h$filter$$(
        hss('ul', {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            paddingTop: '0.5rem',
        }),
        store.todos,
        TodoComponent,
        store.visibilityFilter,
    )
}

const TodoComponent = (todo: Todo) => (
    hc('li', [
        wrapper([
            input(todo.done),
            ht('span', todo.text)
        ])
    ])
)

const wrapper = <C>(children: Component<C>[]) => 
    Remove(Slide(
        h('label', {
            children,
            css: {
                display: 'block',
                backgroundColor: 'aliceblue',
                padding: '0.25rem 0.5rem',
                marginBottom: '0.5rem',
                cursor: 'pointer',
            }
        })
    ))

const Remove = cssTx(
    { height: 500, margin: 500, padding: 500 },
    { height: '0', margin: '0', padding: '0' },
    { height: '2rem', margin: null, padding: null },
)
const Slide = cssTx(
    { transform: 500, opacity: 500 },
    { transform: 'translateX(-1em)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 },
)

const input = (check: StreamBox<boolean>) => (
    $bindCheck(
        h('input', {
            props: { type: 'checkbox' },
            css: {
                verticalAlign: 'middle',
                marginRight: '0.5rem',
            }
        }),
        check
    )
)