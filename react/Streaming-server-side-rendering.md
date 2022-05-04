// reference: https://www.patterns.dev/posts/ssr/

__Streaming Server-side rendering__'s Aim was to imporve `SSR` performance.

React supported Streaming in React 16 in 2016. The API was ReactDOMServer.

What is the difference of the SSR and Server Component?
1. Server Component is only rendered by the server.
2. Server Component is Zero Size, all import modules will not send to the client.
3. SSR is generated the entire HTML at once, and send it to the client
4. SSR should waited the hole HTML is loaded and excuting the hydration.

The related topis
1. Streaming Server-side Rendering
2. Server-side Rendering with suspense
3. Server Component
