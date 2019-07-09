# @crui/core
The aim of this package is to be the foundation on top of which the rest is built. For this reason, we value composability and performance over everything else.

@crui/core has two main concepts: 

* Elements: building blocks that generate Components and the final UI
* Setups: configure the many aspects of an Element

Both Elements and Setups are based on functions, therefore are immutable definitions of our UI

## Setups

* child: append a child to an Element
* children: append many children to an Element
* on: setup an event handler
* onClick: setup an 'click' event handler
* props: setup Element's properties
* style: setup inline styling
* cleanup: hook to cleanup resources once the Element is disposed
* addText: append a Text. Equivalent of `child` + `text`

We also provide two utilities to combine setups:

* sc2: SetupCombine2, combine two setups into one
* sc: SetupCombine, combine a list of setups

## Elements

* h: the main building block for HTML elements
* text: create a Text element, which is **the way** to securely display texts
* br: the `br` tag
* ht: shortcut for `h` + `children` setup
* empty: an empty element, useful as a placeholder for dynamic content
* e: escape hatch to create special elements

We also have higher-order elements, ie: elements that build on top of other elements:

* useContext: allow the use of [Context](#context-api) to generate a new [Component](#what-is-a-component)
* withContext: adapt Context to a Component
* withSetup: apply a new setup to a Component

## Mounting
Generating components will do nothing at all, remember that they are just definition of what needs to be done. To materialize a definition, we need to *mount* it.

The most common mounting operation is to render it in the browser DOM:
```typescript
import { text } from '@crui/core/elems/text'
import { mount } from '@crui/core/dom/browser'

mount(
    document.getElementById('root')!,
    text('Hello World'),
    {}
)
```

The first element is just a valid HTML Node to which we will append the final result of the materialized component, which in this case is a simple Text node.  
The third and final argument is the Context.

Supposing our server rendered an HTML with a body like this:
```html
<body>
    <div id="root"></div>
</body>
```

Once the above typescript code runs in the browser, it will become:
```html
<body>
    <div id="root">Hello World</div>
</body>
```

## Learn by Examples

All the following example will omit the `mount` part.

Unless specified otherwise, all function can be imported from `@crui/core`.
Each function can also be imported singularly to reduce boundle size; have a look at source code for more information.

### Element with Text
```typescript
import { h, child, text } from '@crui/core'
import { mount } from '@crui/core/dom/browser'

const title = h('h1', child(
    text('<Hello World>')
))
```

This will generate an HTML equivalent to:
```html
<h1>&lt;Hello World&gt;</h1>
```

The `title` component could be more easily written as:
```typescript
import { ht, text } from '@crui/core'

const title = ht('h1', '<Hello World>')
```

### List of elements
```typescript
import { hc } from '@crui/core/elems/children'
import { ht } from '@crui/core/elems/ht'

const list = hc('ul', [
    ht('li', 'a')
    ht('li', 'b')
    ht('li', 'c')
])
```

### Shouter
```typescript
const shouter = (str: string) => (
    h('button', sc2(
        child(text(str)),
        onClick(() => alert(str.toUpperCase()))
    ))
)

const shouters = hc('div', [
    shouter('a'),
    shouter('b'),
    shouter('c')
])
```

As a reminder:
* sc2: combine two Setup into one, in this case `child` and `onClick`
* child: append an element
* onClick: setup a `click` event handler

Therefore it's equivalent to:
```html
<div>
    <button onClick="alert('a'.toUpperCase())">a<button>
    <button onClick="alert('b'.toUpperCase())">b<button>
    <button onClick="alert('c'.toUpperCase())">c<button>
</ul>
```

CRUI is highly based on functions, so it should be no surprise that the way to generate sharable and reusable Components is by wrapping Elements in just another function :)

The best part is that we can use all normal means of abstraction, eg:
```typescript
const shouter = (str: string) => (...)
const shouters = hc('div', ['a', 'b', 'c'].map(shouter))
```

### Simple Form
This example further demonstrate how easy is it to abstract concepts and how readable it can be.

```typescript
const form = h('form', sc2(
    props({ action: '/signup', method: 'POST' }),
    children([
        field('First name', 'text', 'first-name'),
        field('Last name', 'text', 'last-name'),
        field('E-Mail', 'email', 'email'),
        field('Password', 'password', 'pass'),
        field('Confirm', 'password', 'confirm'),
    ])
))

type Type = 'text'|'email'|'password'

const field = (text: string, type: Type, name: string) => 
    hc('div', [
        label(name, text)
        input(type, name)
    ])

const input = (type: Type, name: string) => 
    h('input', props({ id: name, name, type }))

const label = (target: string, text: string) => 
    h('label', sc([
        props({ labelFor: target }),
        style({ fontWeight: 'bold', marginRight: '1rem' }),
        addText(text)
    ]))
```

Equivalent to:
```html
<form action="/signup" method="POST">
    <div>
        <label for="first-name">First name</label>
        <input type="text" id="first-name" name="first-name">
    </div>
    <div>
        <label for="last-name">Last name</label>
        <input type="text" id="last-name" name="last-name">
    </div>
    <div>
        <label for="email">E-Mail</label>
        <input type="email" id="email" name="email">
    </div>
    <div>
        <label for="pass">Password</label>
        <input type="password" id="pass" name="pass">
    </div>
    <div>
        <label for="confirm">Confirm</label>
        <input type="password" id="confirm" name="confirm">
    </div>
</form>
```

## What is a Component?
A Component is just a function that receives a [DOM](#abstract-dom) and [Context](#context-api) and returns a rendered Node plus cleanup functions and meta. This is all we need to make a composable interface.

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
Given that all functions rely on the passed DOM, you can already see how easy would be to support snapshot testing, which is something will be provided as a library. For this reason is very important that each Element respects the contract and never use global or environment specific code.

Testing is not the only area were this abstraction will be useful: SSR (Server Side Rendering) should be possible, even though it's not as straightforward once reactivity is mixed in the bag.

## Context API
Sometimes we need to pass a particular piece of information down in the components tree. We could thread this information through all the components, but it becomes unpractical and tedious very soon.  
An example is internationalization (i18n). Let's say we need a component that can render a translated message given a key:
```typescript
type I18n = {
    t: (key: string) => string
}
const t = (i18n: I18n, key: string) => 
    h('span', sc2(
        props({ className: 'i18n' }),
        addText(msg)
    ))
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
This works, but it's tedious to write and the number of args needed could explode depending on how much central state we have.

A better approach would be to let only the `t` component care about `i18n` and nothing else. To do so, we can use the Context API: a piece of information that will be automatically threaded through our elements by CRUI.
```typescript
const t = (key: string) => useContext(
    ({ t }) => (
        h('span', sc2(
            props({ className: 'i18n' }),
            addText(t(key))
        ))
    )
)
```
The component will now capture the context, which in this case is just `I18n`, use it to get the translated key and then pass it down to `text` component.

Now any other component don't need to know about i18n anymore and code is cleaner:
```typescript
const homeTitle = hc('h1', [t('home-title')])

const home = hc(
    homeTitle,
    homeContent
)
```

The actual Context is provided on mounting:
```typescript
import { mount } from '@crui/core/dom/browser'

mount(
    document.getElementById('root'),
    home,
    makeI18n()
)
```
One nice gain of using typescript, is that now `mount` will complain if we don't pass the right Context, telling as exactly what is needed to satisfy the whole tree.