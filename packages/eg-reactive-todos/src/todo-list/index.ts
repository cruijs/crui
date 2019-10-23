import { DRW$B } from '@crui/reactive/rx/box/types';
import { cssTx } from '@crui/transitions/elems/cssTx';
import { bindChecked } from '../../v2/actions/bind';
import { children, Children } from '../../v2/actions/children';
import { css } from '../../v2/actions/css';
import { Css } from '../../v2/actions/css/index';
import { h } from '../../v2/actions/elem';
import { Elem } from '../../v2/actions/elem/index';
import { ht } from '../../v2/actions/ht';
import { TagMR } from '../../v2/actions/tagAction';
import { Todo, TodoStore } from '../store';

export function TodoList(store: TodoStore) {
    return h('ul', [
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
    ])
}

const TodoComponent = (todo: Todo) => (
    h('li', [
        wrapper([
            input(todo.done),
            ht('span', todo.text)
        ])
    ])
)

const wrapper = <E extends Elem<any, any>>(elems: readonly TagMR<E>[]) => (
    // Remove(Slide(
        h<'label', Css|E>('label', [
            css({
                display: 'block',
                backgroundColor: 'aliceblue',
                padding: '0.25rem 0.5rem',
                marginBottom: '0.5rem',
                cursor: 'pointer',
            }),
            ...elems,
        ])
    // ))
)

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
    h('input', [
        bindChecked(check),
        css({
            verticalAlign: 'middle',
            marginRight: '0.5rem',
        }),
    ])
)