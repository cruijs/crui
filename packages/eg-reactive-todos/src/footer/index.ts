import { h, ht, onClick, text } from '@crui/core';
import { css } from '@crui/css-emotion';
import { $css } from '@crui/css-emotion-reactive';
import { map, RW$B } from '@crui/reactive/rx/box';
import { TodoStore, Visibility } from '../store';

export const Footer = (s: TodoStore) => {
    const vis = s.getVisibility()
    return h('div', [ css({ marginTop: '1rem' }) ], [
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
) => (
    h('button', [
        onClick((e) => {
            e.preventDefault()
            $vis.set(vis)
        }),
        css({
            marginLeft: '0.5rem',
            '&:first-child': {
                marginLeft: 0,
            }
        }),
        $css(
            map($vis, (v) => v === vis),
            { color: 'red' }
        )
    ], [
        text(label),
    ])
)