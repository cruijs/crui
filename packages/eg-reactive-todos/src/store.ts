import { StreamBox } from '@crui/reactive/rx/box';
import { StreamList } from '@crui/reactive/rx/list';
import { Predicate$ } from '@crui/reactive/rx/list/filter/$filter$';

export type Todo = {
    done: StreamBox<boolean>,
    text: string,
}

export type TodoList = StreamList<Todo>
export enum Visibility {
    ALL,
    DONE,
    TODO,
}
export class TodoStore {
    public readonly input: StreamBox<string>
    public readonly visibility: StreamBox<Visibility>
    public readonly visibilityFilter: StreamBox<Predicate$<Todo>>
    public readonly todos: TodoList

    constructor() {
        this.input = new StreamBox('')
        this.todos = new StreamList<Todo>([])
        this.visibility = new StreamBox<Visibility>(Visibility.ALL)
        this.visibilityFilter = this.visibility.map(vis2pred)
    }

    addTodo(todo: string): void {
        this.todos.push({
            text: todo,
            done: new StreamBox<boolean>(false)
        })
    }

    dispose() {
        this.todos.destroy()
        this.visibilityFilter.destroy()
        this.visibility.destroy()
        this.input.destroy()
    }
}

function vis2pred(v: Visibility): Predicate$<Todo> {
    switch (v) {
        case Visibility.ALL:
            const $true = new StreamBox(true)
            return () => $true
        case Visibility.DONE:
            return (todo) => todo.done.clone()
        case Visibility.TODO:
            return (todo) => todo.done.map((b) => !b)
    }
}