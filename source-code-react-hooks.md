# 2022/4/9
## react hooks

```js
function useState(initialState){
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function useReducer(initialState){
  const dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
```
