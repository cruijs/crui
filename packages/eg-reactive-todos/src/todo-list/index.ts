import { DRW$B } from '@crui/reactive/rx/box/types';
import { cssTx } from '@crui/transitions/elems/cssTx';
import { bindChecked } from '../../v2/actions/bind';
import { children } from '../../v2/actions/children';
import { css, Css } from '../../v2/actions/css';
import { Elem, h } from '../../v2/actions/elem';
import { ht } from '../../v2/actions/ht';
import { listView } from '../../v2/actions/rx-list-view';
import { template } from '../../v2/actions/template';
import { dynamic } from '../../v2/actions/template/dynamic';
import { TagMR } from '../../v2/retrictions/tag';
import { Todo, TodoStore } from '../store';

export function TodoList(store: TodoStore) {
    return h('ul', [
        listView(
            store.getVisibleTodos(),
            TodoComponent(),
        ),
        css({
            listStyle: 'none',
            padding: 0,
            margin: 0,
            paddingTop: '0.5rem',
        })
    ])
}

const TodoComponent = () => {
    const child = wrapper((todo) => [
        input(todo.done),
        ht('span', todo.text)
    ])
    return template<Todo, 'li', typeof child>('li', [
        child
    ])
}

const wrapper = <E extends Elem<any, any>>(make: (todo: Todo) => readonly E[]) => {
    const dyn = dynamic(
        (todo: Todo) => children(make(todo))
    )
    // Remove(Slide(
    return h<'label', Css | typeof dyn>('label', [
        css({
            display: 'block',
            backgroundColor: 'aliceblue',
            padding: '0.25rem 0.5rem',
            marginBottom: '0.5rem',
            cursor: 'pointer',
        }),
        dyn as TagMR<typeof dyn>
    ])
    // ))
}

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