import { map, RW$B } from '@crui/reactive/rx/box';
import { css } from '../../v2/actions/css/index';
import { h } from '../../v2/actions/elem';
import { onClick } from '../../v2/actions/event';
import { ht } from '../../v2/actions/ht';
import { $css } from '../../v2/actions/rx-css';
import { text } from '../../v2/actions/text';
import { TodoStore, Visibility } from '../store';

export const Footer = (s: TodoStore) => {
    const vis = s.getVisibility()
    return h('div', [
        css({ marginTop: '1rem' }),
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
        text(label),
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
    ])
)