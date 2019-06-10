import { hc } from '@crui/core/elems/children';
import { text } from '@crui/core/elems/text';
import { hcs } from '@crui/css-emotion/elems/hcs';
import { AddTodo } from './add-todo';
import { Footer } from './footer';
import { TodoStore } from './store';
import { TodoList } from './todo-list';

export const TodoPage = (store: TodoStore) => 
    hc('div', [
        hcs('h1', { textAlign: 'center', marginBottom: '2rem' }, [
            text('CRUI - Todo')
        ]),
        AddTodo(store),
        TodoList(store),
        Footer(store),
    ])