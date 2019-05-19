import { hc } from '@crui/core/elems/children';
import { ht } from '@crui/core/elems/ht';
import { text } from '@crui/core/elems/text';
import { h$ } from '@crui/reactive/elems';
import { StreamBox } from '@crui/reactive/rx/box';
import { Component } from '../../../core/dom/index';
import { TodoStore, Visibility } from '../store';

export const Footer = ({ visibility }: TodoStore) => (
    hc('div', [
        ht('span', 'Show: '),
        Filter(visibility, Visibility.ALL, 'All'),
        Filter(visibility, Visibility.TODO, 'Active'),
        Filter(visibility, Visibility.DONE, 'Completed'),
    ])
)

const Filter = (
    $vis: StreamBox<Visibility>,
    vis: Visibility,
    label: string
): Component => {
    const className = $vis.map((v) => (
        'filter ' + (v === vis ? 'active' : '')
    ))

    return h$('button', {
        unsub: className.destroy,
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