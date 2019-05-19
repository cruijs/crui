import { Component, Tag } from '@crui/core/dom';
import { h } from '@crui/core/elems';
import { hc } from '@crui/core/elems/children';
import { text } from '@crui/core/elems/text';
import { h$ } from '@crui/reactive/elems';
import { h$filter$$ } from '@crui/reactive/elems/filter/h$filter$$';
import { cssTx } from '@crui/transitions/cssTx';
import { Todo, TodoStore } from '../store';

const hcc = (tag: Tag, className: string, children?: Component[]) =>
    h(tag, {
        props: { className },
        children
    })

export function TodoList(store: TodoStore) {
    return h$filter$$(
        hcc('ul', 'todo-list'),
        store.todos,
        TodoComponent,
        store.visibilityFilter,
    )
}

function TodoComponent(todo: Todo): Component {
    return hcc('li', 'todo-wrapper', [
        Slide(hcc('label', 'todo', [
            h$('input', {
                props: {
                    type: 'checkbox',
                },
                $bind: {
                    checked: todo.done
                }
            }),
            hc('span', [
                text(todo.text)
            ]),
        ]))
    ])
}

const Slide = cssTx(
    { transform: 500, opacity: 500 },
    { transform: 'translateX(-1em)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 },
)