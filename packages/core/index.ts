import { Tag } from './dom';
import { h } from './h';
import { Component } from './dom/index'

export function hc(tag: Tag, children: Component[]): Component {
    return h(tag, { children })
}