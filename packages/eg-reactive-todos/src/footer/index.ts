import { Component } from '@crui/core/dom/index';
import { hc } from '@crui/core/elems/children';
import { ht } from '@crui/core/elems/ht';
import { text } from '@crui/core/elems/text';
import { h$ } from '@crui/css-emotion-reactive/elems';
import { StreamBox } from '@crui/reactive/rx/box';
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
    return h$('button', {
        children: [
            text(label)
        ],
        events: {
            click: (e) => {
                e.preventDefault()
                $vis.set(vis)
            }
        },
        css: {
            marginLeft: '0.5rem',
            '&:first-child': {
                marginLeft: 0,
            }
        },
        $css: [{
            cond: $vis.map((v) => v === vis),
            style: { color: 'red' }
        }]
    })
}