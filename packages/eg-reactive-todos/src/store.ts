import { map, R$B, RW$B, StreamBox } from '@crui/reactive/rx/box';
import { clone } from '@crui/reactive/rx/box/clone';
import { DRW$B } from '@crui/reactive/rx/box/types';
import { RW$L, StreamList } from '@crui/reactive/rx/list';
import { Predicate$ } from '@crui/reactive/rx/list/filter/$filter$';
import { Destroyable } from '@crui/reactive/rx/types';

export type Todo = {
    done: DRW$B<boolean>,
    text: string,
}

export enum Visibility {
    ALL,
    DONE,
    TODO,
}

export type $TodoList = RW$L<Todo>
type $Input = RW$B<string>
type $Visibilty = RW$B<Visibility>
type $VisFilter = R$B<Predicate$<Todo>>

export class TodoStore {
    private readonly input: $Input & Destroyable
    private readonly visibility: $Visibilty & Destroyable 
    private readonly visibilityFilter: $VisFilter & Destroyable
    private readonly todos: $TodoList & Destroyable

    constructor() {
        this.input = new StreamBox('')
        this.todos = new StreamList<Todo>([])
        this.visibility = new StreamBox<Visibility>(Visibility.ALL)
        this.visibilityFilter = map(this.visibility, vis2pred)
    }

    dispose() {
        this.todos.destroy()
        this.visibilityFilter.destroy()
        this.visibility.destroy()
        this.input.destroy()
    }

    getTodos(): $TodoList {
        return this.todos
    }
    addTodo(todo: string): void {
        this.todos.push({
            text: todo,
            done: new StreamBox<boolean>(false)
        })
    }

    getInput(): $Input {
        return this.input
    }

    getVisibility(): $Visibilty {
        return this.visibility
    }

    getVisibilityFilter(): $VisFilter {
        return this.visibilityFilter
    }
}

function vis2pred(v: Visibility): Predicate$<Todo> {
    switch (v) {
        case Visibility.ALL:
            const $true = new StreamBox(true)
            return () => $true
        case Visibility.DONE:
            return (todo) => clone(todo.done)
        case Visibility.TODO:
            return (todo) => map(todo.done, (b) => !b)
    }
}