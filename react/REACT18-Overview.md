# Overview

What's the CORE of `React 18`, before starting a new study, I'm to write down some my knows for a recap:

## New Features
1. Streaming rendering
2. Sever-side Rendring by Suspense
3. Server Component (Experimental)
4. What's the differents between Server Component and Server Side Rendering?
    Server Component only run in the server, and sends to client by Streaming connections. Server Component sends to client with special constructure and REACT use these datas to paint the views. Otherwise, SSR was build at server and hybrids on the clients. 

### React 18 Conference
> Lauren
1. Automatic Batching
2. UseId
3. Server Components

__Opt in__ features
1. startTranstion
2. useDeferedValue
3. Streaming SSR with Suspense

__Concepts__
1. concurrent rendering
2. concurrent mode


## React 18 Main Course
### Concurrency
#### Concurrency APIs
1. useTransition()
2. startTransition()
3. useDeferredValue()

#### New Hooks for Library Authors
1. useSyncExternalStore()
2. useInsersionEffect()
3. useId()

#### behind-the-scenes (automatical)
1. State Batching
2. Improve Suspense (support by Server-side-rendring)
3. Server Components (future)


## About Nextjs 12
1. pre-rendering (note: nextjs is pre-rendering by all pages.)
    - Static Site Generation (SSG)
    - Server Side Rendering (SSR)
    - Increment Site Generation (ISR)
