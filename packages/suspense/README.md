# CRUI - Suspense
This package implements the same idea behind React Suspense, while providing a much cleaner API to work with.

## The problem
*If you are already familiar with React Suspense, feel free to skip this section.*

CRUI philosophy is to push data outside Components, usually in Stores, but sometimes we have Components that need to fetch some information before being able to correctly render. The most simple and classic example is an image:
```typescript
import { hc, hp, ht } from '@crui/core'
import { mount } from '@crui/core/dom/browser'

mount(
    document.getElementById('root')!,
    hc('div', [
        hp('img', {
            src: '/some/image.png'
        }),
        ht('span', 'Hello')
    ]),
    {}
)
```

This is equivalent to:
```html
<div><img src="/some/image.png"><span>Hello</span></div>
```
Notice that `img` and `span` are both inline elements and will be displayed one after the other.  
The problem with this code is that, in case the image is large and not yet cached, once it loaded it will trigger a reflow and all the layout will do an ugly-to-see jump.  
In this particular case the "Hello" string will jump to the right.

## Suspense to the rescue!
Suspense allows us to **suspend** a component from rendering until everything is ready and display some filler in the meantime.

That's exactly what we need to avoid reflows: ensure that image is loaded and ready before inserting it in the dom.

Let's make a component to wrap this logic:
```typescript
// image.ts
import { h, useContext } from '@crui/core'
import { noop } from '@crui/core/utils/noop'
import { WithSuspend } from '@crui/suspense'

export const img = (src: string) => useContext(({ waitFor }: WithSuspense) => {
    let load = noop
    let error = noop
    const p = new Promise((resolve, reject) => {
        load = resolve
        error = reject
    })
    waitFor(p)

    return h('img', {
        props: { src },
        events: { load, error }
    })
})
```
CRUI Suspense API is based on Context API and Promises. This element in particular expects to find a `waitFor` function in context. The signature for this function is:
```typescript
function waitFor(p: PromiseLike<any>): void
```
It gets a promise and inform a Suspender up in the Components tree that we are not yet ready to render.

The ugly bit is binding the Promise `p` to the event handlers that will tell us if an image loaded or not. Once done, we pass it to `waitFor` and then return the Component as usual.

The type for our new `img` will therefore be:
```typescript
Component<WithSuspense>
```
In case you are not yet familiar with the Context API, this is telling us (and the compiler) that we need to provide a context that satisfy `WithSuspense` constraint when mounting it.

Let's move on and change our initial code to use our new component:
```typescript
import { hc, ht } from '@crui/core'
import { mount } from '@crui/core/dom/browser'
import { img } from './image'

const comp = hc('div', [
    img('/some/image.png'),
    ht('span', 'Hello')
])

mount(document.getElementById('root')!, comp, {})
```
This will not compile because `{}` doesn't satisfy the `WithSuspense` constraint. This is nice, but just providing the right context will not be enough, we need to insert a `suspend` point in the Component tree. In this case we can just add it as the root, but anywhere before `img` is fine:

```typescript
import { hc, ht, text } from '@crui/core'
import { suspend } from `@crui/suspense`
import { img } from './image'

const comp = suspend(
    text('... Loading ...'),
    hc('div', [
        img('/some/image.png'),
        ht('span', 'Hello')
    ]),
    () => text('Oops! Looks like an error occurred :('),
)

mount(document.getElementById('root')!, comp, {})
```

This time it compiles! Let's have a look at the type signature:
```typescript
function suspend<E, C>(
    loading: Component<C>,
    success: Component<C & WithSuspense>,
    error: (err: E) => Component<C>
): Component<C>
```
It expects 3 components:
* loading: displayed on first render and while the main component is not ready
* success: displayed once all resources are loaded
* error: displayed if an error occurred

The first interesting bit is that `success` must require a `WithSuspense` context, but this constraint is lifted from the returned Component. **This allow us to have multiple, independent suspend point** in the Component tree.  
Another detail worth mentioning is that `error` receives the error thrown by the faulty Promise, so this will allow us to display useful information to our users about what exactly went wrong.

All three components are required, so you can't accidentally forget about handling errors :)

## How does it work?
There are many design choices that made Suspense quite easy to implement in CRUI even though it's so powerful:
* Components are just functions
* Context is automatically threaded down in the component tree, so it's easy to change it for an entire sub-tree.
* Components cannot arbitrarily insert themselves in the DOM, but a parent Component can freely manipulate their direct children and itself
* Reactivity is pluggable

All of this allows `suspend` do materialize the `success` sub-tree which in turn trigger all the `waitFor` calls that it needs to handle before mounting it.  
In the meantime it presents itself to its parent as the `loading` component and once all collected promises are done, it will swap `loading` with the, now ready, `success` sub-tree (or the `error` one if something went wrong).

As a side node, there is a little optimization that will just display the `success` sub-tree in case none of its descendants call `waitFor`.
