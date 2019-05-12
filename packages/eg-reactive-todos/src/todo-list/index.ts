import { Component } from '@crui/core/dom';
import { h } from '@crui/core/elems';
import { hc } from '@crui/core/elems/children';
import { text } from '@crui/core/elems/text';
import { h$ } from '@crui/reactive/elems';
import { h$map } from '@crui/reactive/elems/h$map';
import { DOMNode, Tag } from '../../../core/dom/index';
import { tx } from '../../../transactions/index';
import { Todo, TodoStore } from '../store';

const hcc = (tag: Tag, className: string, children?: Component[]) =>
    h(tag, {
        props: { className },
        children
    })

export function TodoList(store: TodoStore) {
    return h$map(
        hcc('ul', 'todo-list'),
        store.getTodos(),
        TodoComponent
    )
}

function TodoComponent(todo: Todo): Component {
    return hcc('li', 'todo-wrapper', [
        Slide(hcc('label', 'todo', [
            hc('span', [
                text(todo.text)
            ]),
            h$('input', {
                props: {
                    type: 'checkbox',
                },
                $bind: {
                    checked: todo.done
                }
            })
        ]))
    ])
}

const trans = (node: DOMNode, f: (node: DOMNode) => void) => () => new Promise<void>((resolve) => {
    f(node)
    node.ontransitionend = () => resolve()
    node.ontransitioncancel = node.ontransitionend
})

const Slide = tx((node) => {
    const moveOut = (node: DOMNode) => {
        node.style.transform = 'translateX(-1em)'
        node.style.opacity = '0'
    }
    moveOut(node)

    return {
        intro: trans(node, (node) => {
            node.style.transform = 'translateX(0)'
            node.style.opacity = '1'
        }),
        outro: trans(node, moveOut)
    }
})