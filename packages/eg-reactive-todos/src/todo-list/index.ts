import { Component } from '@crui/core/dom';
import { hc } from '@crui/core/elems/children';
import { h } from '@crui/core/elems/h';
import { ht } from '@crui/core/elems/ht';
import { children } from '@crui/core/setups/children';
import { sc2 } from '@crui/core/setups/combine/two';
import { css } from '@crui/css-emotion/setups/css';
import { DRW$B } from '@crui/reactive/rx/box/types';
import { bindChecked } from '@crui/reactive/setups/bind';
import { c$filter$$ } from '@crui/reactive/setups/filter';
import { cssTx } from '@crui/transitions/elems/cssTx';
import { Todo, TodoStore } from '../store';

export function TodoList(store: TodoStore) {
    return h('ul', sc2(
        c$filter$$(
            store.getTodos(),
            TodoComponent,
            store.getVisibilityFilter(),
        ),
        css({
            listStyle: 'none',
            padding: 0,
            margin: 0,
            paddingTop: '0.5rem',
        })
    ))
}

const TodoComponent = (todo: Todo): Component<{}> => (
    hc('li', [
        wrapper([
            input(todo.done),
            ht('span', todo.text)
        ])
    ])
)

const wrapper = <C>(cs: Component<C>[]) => 
    Remove(Slide(
        h('label', sc2( 
            children(cs),
            css({
                display: 'block',
                backgroundColor: 'aliceblue',
                padding: '0.25rem 0.5rem',
                marginBottom: '0.5rem',
                cursor: 'pointer',
            }),
        ))
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

const input = (check: DRW$B<boolean>) => (
    h('input', sc2(
        bindChecked(check),
        css({
            verticalAlign: 'middle',
            marginRight: '0.5rem',
        }),
    ))
)