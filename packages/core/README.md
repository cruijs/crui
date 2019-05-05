# @crui/core
The aim of this package is to be the foundation on top of which all the other builds on. For this reason, we value composability and performance over everything else.

## What is a Component?
A component is just a simple function that receive a DOM and Context (more on this later) and return a [Rendered](elems/rendered.ts).
To ensure composability, Components should always use the DOM object passed to them rather than accessing directly the `document` object.

We have many helper function to build all the static structure that we need.

### e
The simplest of them all, return an empty node for the given elemet:
```typescript
import { e } from './elems/elem'

const div = e('div')
```
Equivalent to:
```html
<div></div>
```

### text
A simple text node, used to display text and avoid XSS altogether:
```typescript
import { text } from './elems/text'

const msg = text('<span>Message</span>')
```
Equivalent to:
```html
&lt;span&gt;Message&lt;/span&gt;
```

### hc
The "c" in "hc" stands for "children", so this function define a node with **c**hildren:
```typescript
import { hc } from './elems/hc'

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
A handy function that render some **t**ext into an element:
```typescript
import { hc } from './elems/hc'
import { ht } from './elems/ht'

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
Render an element with **p**roperties:
```typescript
import { hp } from './elems/hp'

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

Please be careful to not confuse properties with *attributes*. They are almost equivalent, but there are indeed some differences. The most known one is the attribute `class` and the attribute `className`:
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
import { hp } from './elems/he'

const alert = he('button', {
    click: () => alert('Hi, there!')
})
```
Equivalent to:
```html
<button onClick="alert('Hi, there!')"></button>
```
Events will be properly cleaned up once the element is unmounted.

### hlc
A node with a particular **l**ife**c**ycles:
```typescript
import { hlc } from './elems/lifecycles'

const special = hlc('div', {
    mounted: (node) => {
        console.log('Here we go!')
        node.className = 'intro'
        // nothing to unsubscribe
        return () => {}
    },
    willUnmount: (node) => {
        node.className = 'outro'
        return new Promise((resolve) => setTimeout(resolve, 500)).then(
            () => console.log('unmounted')
        )
    }
})

```
As soon as the `div` element will be mounted, it will add the className `intro`, which could for example trigger an animation. This expect to return an `unsubscribe` function in case we need to do some extra cleanup once unmounted.
Once the node is ready to be unmounted, it will then trigger the `willUnmount`, which in this case change the class to be `outro' that perhaps trigger an another animation that last for 500 milliseconds. The return is a Promise that will delay the actual removal from the DOM, so that the animation will have enough time to fully run.

It's worth mentioning that lifecycles have a cascading effect, so if one or more descendants children (no matter at which depth) of a node have a `willUnmount` lifecycle setup, the parent node will be removed only once all of those Promises have been resolved.

All promises at same depth run in parallel, while each promise 

If one promise throw an error, it will be logged in the console but the node is still unmounted.


### h
Ok, we can add properties, events and children, but what if we want an attribute with *all* of them? Here it comes `h`!
```typescript
import { h } from './elems'

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
Equivalent to:
```html
<ul class="list">
    <li class="item" onClick="alert('A')">a</li>
    <li class="item" onClick="alert('B')">b</li>
    <li class="item" onClick="alert('C')">c</li>
</ul>
```
This function aggregates the functionality of all the other ones and each of them is optional, as you can notice from the fact the `ul` only has `children` and `props`.

It's usually better to rely on the others elements if possible given that are a little cleaner to write.

## Context API
Sometimes we need to pass a particular piece of information down in the components tree. We could thread this information through all the components, but this become unpractical very soon.
A practical example is internationalization (i18n). Let's say we have a component that can render a translated message given a key:

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
    hc('h1', t(i18n, 'home'))
```
Even when you don't really care about translations per se:
```typescript
const home = (i18n: I18n) => hc(
    homeTitle(),
    homeContent()
)
```
This works, but it's quite boilerplatey and the number of args that we will need to pass could explode depending on how much central state we have.

A better approach would be to let only the `t` component care about `i18n` and nothing else. To do so, we can use the Context API: a piece of information that will be automatically threaded through our elements by CRUI.
```typescript
import { useContext } from '@crui/core/elems/useContext'
import { text } from '@crui/core/elems/text'

const t = (key: string) => useContext(
    (i18n: I18n) => i18n.t(key),
    (msg) => (
        h('span', { 
            props: { className: 'i18n' },
            children: [ text(msg) ]
        })
    )
)
```
The component will now capture the context, which in this case is just `I18n`, use it to get the translated key and then pass it down to `text` component.

Now any other components don't need to know about i18n anymore and code is more streamlined:
```typescript
const homeTitle = hc('h1', t('home'))

const home = hc(
    homeTitle(),
    homeContent()
)
```

But then how do we provide the i18n instance? Is it global? Nope, we need to provide it once we mount the root component:
```typescript
import { mount } from '@crui/core/dom/browser'

mount(
    document.getElementById('root'),
    home,
    new I18n()
)
```
One nice gain of using typescript, is that now `mount` will complain if we don't pass the right Context, telling as exactly what is needed to satisfy the whole tree.
