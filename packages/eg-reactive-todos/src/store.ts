import { clone, DRW$B, map, RW$B, StreamBox } from '@crui/reactive/rx/box';
import { Destroyable, DR$L, StreamList, W$L } from '@crui/reactive/rx/list';
import { Predicate$ } from '@crui/reactive/rx/list/filter/$filter$';
import { $filter$$ } from '@crui/reactive/rx/list/filter/$filter$$';

export type Todo = {
    done: DRW$B<boolean>,
    text: string,
}

export enum Visibility {
    ALL,
    DONE,
    TODO,
}

export type $TodoList = DR$L<Todo>
type $Input = RW$B<string>
type $Visibilty = RW$B<Visibility>

export class TodoStore {
    private readonly input: $Input & Destroyable
    private readonly visibility: $Visibilty & Destroyable 
    private readonly todos: $TodoList & W$L<Todo>
    private readonly visibleTodos: $TodoList

    constructor() {
        this.input = new StreamBox('')
        this.todos = new StreamList<Todo>([])
        this.visibility = new StreamBox<Visibility>(Visibility.ALL)
        this.visibleTodos = $filter$$(this.todos, map(this.visibility, vis2pred))
    }

    dispose() {
        this.todos.destroy()
        this.visibleTodos.destroy()
        this.visibility.destroy()
        this.input.destroy()
    }

    getVisibleTodos(): $TodoList {
        return this.visibleTodos
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