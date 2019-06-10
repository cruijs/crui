import { Component } from '@crui/core/dom/index';
import { ht } from '@crui/core/elems/ht';
import { text } from '@crui/core/elems/text';
import { h$ } from '@crui/css-emotion-reactive/elems';
import { hcs } from '@crui/css-emotion/elems/hcs';
import { map, RW$B } from '@crui/reactive/rx/box';
import { TodoStore, Visibility } from '../store';

export const Footer = (s: TodoStore) => {
    const vis = s.getVisibility()
    return hcs('div', { marginTop: '1rem' }, [
        ht('span', 'Show: '),
        Filter(vis, Visibility.ALL, 'All'),
        Filter(vis, Visibility.TODO, 'Active'),
        Filter(vis, Visibility.DONE, 'Completed'),
    ])
}

const Filter = (
    $vis: RW$B<Visibility>,
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
            cond: map($vis, (v) => v === vis),
            style: { color: 'red' }
        }]
    })
}