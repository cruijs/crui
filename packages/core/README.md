# @crui/core
The aim of this package is to be the foundation on top of which all the other builds on. For this reason, we value composability and performance over everything else.

## Build elements
We have many functions to build all the static structure that we need.

### e
The simplest of them all, returns an empty node for the given element:
```typescript
import { e } from '@crui/core/elems/elem'

const div = e('div')
```
Equivalent to:
```html
<div></div>
```

### text
A simple text node, use it to display text and avoid XSS altogether:
```typescript
import { text } from '@crui/core/elems/text'

const msg = text('<span>Message</span>')
```
Roughly equivalent to:
```html
&lt;span&gt;Message&lt;/span&gt;
```

### hc
Define a node with **c**hildren:
```typescript
import { hc } from '@crui/core/elems/children'

const list = hc('ul', [
    hc('li', [ text('a') ])
    hc('li', [ text('b') ])
    hc('li', [ text('c') ])
])
```
Equivalent to:
```html
<ul>
    <li>a</li>
    <li>b</li>
    <li>c</li>
</ul>
```

### ht
A handy function that renders some **t**ext into an element:
```typescript
import { hc } from '@crui/core/elems/children'
import { ht } from '@crui/core/elems/ht'

const list = hc('ul', [
    ht('li', 'a')
    ht('li', 'b')
    ht('li', 'c')
])
```
Equivalent to:
```html
<ul>
    <li>a</li>
    <li>b</li>
    <li>c</li>
</ul>
```

### hp
Renders an element with **p**roperties:
```typescript
import { hp } from '@crui/core/elems/props'

const inp = hp('input', {
    id: 'test',
    name: 'test',
    value: '123',
    type: 'number',
})
```
Equivalent to:
```html
<input id="test" name="test" type="number" value="123" />
```

Please be careful to not confuse properties with *attributes*. HTML tags have attributes which are then materialized into properties in the DOM Nodes. They are almost equivalent in terms of name, but some differs. The most known one is the attribute `class` that is bound to `className` property:
```typescript
hp('div', { className: 'test' })
```
Equivalent to:
```html
<div class="test"></div>
```

### he
Add **e**vents listeners to an element:
```typescript
import { hp } from '@crui/core/elems/events'

const alert = he('button', {
    click: () => alert('Hi, there!')
})
```
Equivalent to:
```html
<button onClick="alert('Hi, there!')"></button>
```
Events will be properly cleaned up once the element is unmounted.

### h
Ok, we can add properties, events and children, but what if we want an attribute with *all* of them? Here it comes `h`!
```typescript
import { h } from '@crui/core/elems'
import { noop } from '@crui/core/utils/noop'

const tree = h('ul', {
    props: { className: 'list' },
    children: ['a', 'b', 'c'].map((letter) => (
        h('li', {
            props: { className: 'item' },
            events: {
                click: () => alert(letter.toUpperCase())
            },
            children: [
                text(letter)
            ]
        }),
    ))
})
```
Roughly equivalent to:
```html
<ul class="list">
    <li class="item" onClick="alert('A')">a</li>
    <li class="item" onClick="alert('B')">b</li>
    <li class="item" onClick="alert('C')">c</li>
</ul>
```
This function aggregates the functionality of all the other ones and each of them is optional, as you can notice from the fact that `ul` only has `children` and `props`.

## What is a Component?
A Component is just a function that receives a [DOM](#abstract-dom) and [Context](#context-api) and returns a rendered Node plus two others cleanup functions. This is all we need to make a composable interface.

All functions that we have seen so far can be considered as very simple component builders and that's what you will interact with.

For example, let's say that we want to abstract the concept of a list of items:
```typescript
import { hc, text, Component } from '@crui/core'
import { mount } from '@crui/core/browser'

const List = (items: T[], map: (val: T) => Component): Component => (
    hc('ul', items.map((val) => 
        hc('li', map(val))
    ))
)

mount(
    document.getElementById('root'),
    List(['a', 'b', 'c'], text),
    {}
)
```
This will again produce:
```html
<ul>
    <li>a</li>
    <li>b</li>
    <li>c</li>
</ul>
```

## Abstract DOM
As we have seen, Components receive a DOM, but why? Can't they just use `document` directly?

Given that we want to be composable, bounding ourselves to a global variable and a specific environment makes things a lot harder. What we do instead is to abstract out what a DOM and Node is and do so while making it totally transparent to the library user.

The first big benefit is that each Component can be tested in isolation and in a controlled environment:
```typescript
import { e } from '@crui/core/elems/elem'

type Node = { tag: string }
const mockDOM = {
    create(tag): Node {
        return { tag }
    }
    // ... mock all other methods ...
}

describe(e, () => {
    it('generates a node with the right tag', () => {
        expect(
            e('div')(mockDOM, {})
        ).toEquals({ tag: 'div' })
    })
})
```
Given that all functions rely on the passed DOM, you can already see how easy would be to support snapshot testing, which is something will be provided as a library. For this reason is very important that each component builder respects the contract and never use global or environment specific code.

Testing it's not the only area were this abstraction will be useful: SSR (Server Side Rendering) should be possible, even though it's not as straightforward once reactivity is mixed in the bag.

## Context API
Sometimes we need to pass a particular piece of information down in the components tree. We could thread this information through all the components, but it becomes unpractical and tedious very soon.  
A practical example is internationalization (i18n). Let's say we need a component that can render a translated message given a key:
```typescript
type I18n = {
    t: (key: string) => string
}
const t = (i18n: I18n, key: string) => 
    h('span', { 
        props: { className: 'i18n' },
        children: [ text(i18n.t(key)) ]
    })
```

We would then pass down the `i18n` object each time we need to use it, eg:
```typescript
const homeTitle = (i18n: I18n) => 
    hc('h1', t(i18n, 'home.title'))
```
Even when you don't really care about translations per se:
```typescript
const home = (i18n: I18n) => hc(
    homeTitle(i18n),
    homeContent
)
```
This works, but it's tedious to write right and the number of args needed could explode depending on how much central state we have.

A better approach would be to let only the `t` component care about `i18n` and nothing else. To do so, we can use the Context API: a piece of information that will be automatically threaded through our elements by CRUI.
```typescript
import { useContext } from '@crui/core/elems/useContext'
import { text } from '@crui/core/elems/text'

const t = (key: string) => useContext(
    (context: I18n) => context.t(key),
    (msg) => (
        h('span', { 
            props: { className: 'i18n' },
            children: [ text(msg) ]
        })
    )
)
```
The component will now capture the context, which in this case is just `I18n`, use it to get the translated key and then pass it down to `text` component.

Now any other component don't need to know about i18n anymore and code is cleaner:
```typescript
const homeTitle = hc('h1', t('home-title'))

const home = hc(
    homeTitle,
    homeContent
)
```

But then how do we provide the i18n instance? Is it global? Nope, we need to provide it once we mount the root component:
```typescript
import { mount } from '@crui/core/dom/browser'

mount(
    document.getElementById('root'),
    home,
    makeI18n()
)
```
One nice gain of using typescript, is that now `mount` will complain if we don't pass the right Context, telling as exactly what is needed to satisfy the whole tree.