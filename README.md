# Be aware
This repository is currently unmaintained and is still in experimental phase. **Usage of it in production is strongly discouraged**.

---
# CRUI
CRUI stands for and is meant to be:
- **C**omposable: each element is highly composable. This makes the library work towards your needs instead of the other way around.
- **R**eactive: reacting to external inputs is the foundation of user interfaces, so let's make it simple
- **U**ser **I**nterface: lift the hard work to let developers focus on building something great for their users

CRUI also focus on _performance_ and to be as _declarative_ as possible.

## Core

`@crui/core` is a small, flexible and powerful abstraction over the DOM:

```typescript
import { hc, ht } from '@crui/core'
import { mount } from '@crui/core/dom/browser'

const Component = hc('dl', [
    ht('dt', 'CRUI'),
    ht('dd', 'Composable'),
    ht('dd', 'Reactive'),
    ht('dd', 'User'),
    ht('dd', 'Interface'),
])
mount(document.getElementById('root'), Component, {})
```

This code is equivalent to:
```html
<dl>
    <dt>CRUI</dt>
    <dd>Composable</dt>
    <dd>Reactive</dt>
    <dd>User</dt>
    <dd>Interface</dt>
</dl>
```
It builds all the required elements in one shot before adding them into the DOM and therefore ensuring that only one redraw & reflow is performed.  
The Core package only cares about composability and nothing else, so this component is fully static.

To learn more about core, see its [README](packages/core/README.md).

## Reactive
To make a component reactive we'll need `@crui/reactive` package.  
This package is quite small and for some use cases could be too simple, however the fact that Reactivity is just a library ensures it can be changed with something more powerful when needed. That said, for the majority of applications it should be more than enough.

This package implements Reactivity through Streams and **does not** rely on any Virtual DOM. Here is an example of a reactive component:
```typescript
import { h, hc, ht, sc2, props } from '@crui/core'
import { mount } from '@crui/core/dom/browser'
import { StreamBox, bindValue, text$ } from '@crui/reactive'

const Component = (input: StreamBox<string>) => (
    hc('section', [
        ht('h1', 'Echo'),
        h('input', sc2(
            props({ type: 'text' }),
            bindValue(input)
        )),
        hc('p', [
            text$(input)
        ])
    ])
)

const echo = new StreamBox('Hello')
mount(
    document.getElementById('root'),
    Component(echo),
    {}
)
```

The rendered equivalent would be:
```html
<section>
    <h1>Echo</h1>
    <input type="text" value="Hello" />
    <p>Hello</p>
</section>
```

Through `bindValue` we bind the input `value` property to `echo`, which is a StreamBox, ie a stream containing a single value at a time. Now, every time we alter the input value, the message will change too!  
But there is more to it: binding is a two way matter and therefore any change to `echo` will change input value too.

So, if we add this:
```typescript
setTimeout(() => {
    echo.set('Hello, world!')
}, 3000)
```
After 3 seconds the input content will be set to `Hello, world!`.

As we said before, we do not rely on any Virtual DOM, but don't worry, we don't use `.innerHTML` or similar either ;)  
All nodes are rendered as soon as the component is mounted, but the reactive ones are also updated as soon as a new value is available on the Stream.  
Every time we enter something in the input, only the text node inside `p` changes; when the value of `echo` is changed programmatically, given that we know this stream is bound to the `value` prop, we **do not** render the whole input element again, but rather update the `value` property itself.

Long story short: we have surgical updates in par with a VDOM, but without all the calculation, diffs and patching required by it and therefore achieve a better performance.

To know more about `@crui/reactive`, see the dedicated [README](packages/reactive).

## Examples
- [Todo App](packages/eg-reactive-todos)

## Available Packages
- [Reactive](packages/reactive): add Reactivity to CRUI through the use of Streams
- [CSS-in-JS](packages/css-emotion): bindings for [Emotion](https://emotion.sh/)
- [Reactive CSS-in-JS](packages/css-emotion-reactive): elements to model reactive css
- [Suspense](packages/suspense): React-inspired Suspense API
- [Transitions](packages/transitions): base package to build elements with intro & outro animations
- [GSAP Transitions](packages/transitions-gsap): build complex intro & outro animation using [GSAP](https://greensock.com/)
- [Measure](packages/measure): expose component dimensions in a reactive way.

## More to come
- [x] A sane Context API
- [x] Transactions & Animations
- [x] CSS-in-JS support
- [x] Suspense API
- [ ] Easy testing 
- [ ] Server side rendering
- [ ] Use in JS projects while still keeping all possible imports
- [ ] Better documentation

## Credits
This library has been heavily inspired by the awesome work done by:
- [Evan Czaplicki](https://github.com/evancz/) on [ELM](https://elm-lang.org/)
- Facebook and all the community behind [React](https://github.com/facebook/react)
- Michel Weststrate (@mweststrate) on [mobx](https://github.com/mobxjs/mobx)
- Rich Harris (@Rich_Harris) on [Svelte](https://github.com/sveltejs/svelte)
