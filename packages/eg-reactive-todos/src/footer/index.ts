import { Component } from '@crui/core/dom/index';
import { hc } from '@crui/core/elems/children';
import { ht } from '@crui/core/elems/ht';
import { text } from '@crui/core/elems/text';
import { css } from '@crui/css-emotion';
import { h$ } from '@crui/reactive/elems';
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
    const normal = css({
        marginLeft: '0.5rem',
        '&:first-child': {
            marginLeft: 0,
        }
    })
    const active = css({
        color: 'red'
    })
    const className = $vis.map((v) => (
        normal + (v === vis ? ' ' + active : '')
    ))

    const button = h$('button', {
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

    return button
}