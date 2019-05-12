import { hc } from '@crui/core/elems/children';
import { ht } from '@crui/core/elems/ht';
import { text } from '@crui/core/elems/text';
import { h$ } from '@crui/reactive/elems';
import { StreamBox } from '@crui/reactive/rx/box';
import { Component } from '../../../core/dom/index';
import { TodoStore, Visibility } from '../store';

export const Footer = (store: TodoStore) =>
    hc('div', [
        ht('span', 'Show: '),
        Filter(store.visibility, Visibility.ALL, 'All'),
        Filter(store.visibility, Visibility.TODO, 'Active'),
        Filter(store.visibility, Visibility.DONE, 'Completed'),
    ])

const Filter = (
    $vis: StreamBox<Visibility>,
    vis: Visibility,
    label: string
): Component => {
    const { stream: className, unsub } = $vis.map((v) => (
        v === vis ? 'active' : ''
    ))

    return h$('button', {
        unsub,
        $props: { className },
        children: [
            text(label)
        ],
        events: {
            click: (e) => {
                e.preventDefault()
                $vis.set(vis)
            }
        }
    })
}