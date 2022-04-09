# 2022/4/9
## react hooks

// Hooks call stack
// 


///
/// ReactHooks.js
///
function useState(initialState) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function useReducer(initialState) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}

///
/// ReactPartialRenderHooks.js
///

function basicStateReduer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}

function useState(initialState) {
  return useReduer(basicStateReduer, initialState);
}

function useReducer(reducer, initialArg, init) {
  // TODO: read complexity logics
}

// define a object and reference to it.
// the benifits is not rerender when the value is changed.
function useRef(initialValue) {
  // ananlysis look to Key1
  currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
  // 
  workInProgressHook = createWorkInProgressHook();
  const previousRef = workInProgressHook.memoizedState;
  if (previousRef === null) {
    const ref = { current: initialValue };
    workInProgressHook.memoizedState = ref;
    return ref;
  }
  return previousRef;
}

// Hooks
// useState its call path @react --> @react-reconciler
import { useState } from 'react';

// Step1: Hooks Entrance
// packages\react\src\ReactHooks.js
// ---------------------------------------------
// useId
// useCallback
// useContext
// useDebugValue
// useDeferredValue
// useEffect
// useImperativeHandle
// useInsertionEffect
// useLayoutEffect
// useMemo
// useMutableSource
// useSyncExternalStore
// useReducer
// useRef
// useState
// useTransition
// ---------------------------------------------

// ReactCurrentDispatcher
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  return dispatcher;
}

function useState(initialState) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function useReducer(reducer, initialArg, init) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}

function useRef(initialValue) {
  const dispathcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}

// @react
// ReactCurrentDispatcher is a global variation
// ReactHooks.js --> ReactCurrentDispatcher.js --> ReactSharedInternals.js
import ReactCurrentDispatcher from './ReactCurrentDispatcher';
const ReactSharedInternals = { ReactCurrentDispatcher }
export default ReactSharedInternals;

// @react-reconciler
// ReactFiberHooks.new.js --> ReactSharedInternals.js
function renderWithHooks() {
  ReactCurrentDispatcher.current =
    current === null
      ? HooksDispatcherOnMount
      : HooksDispatcherOnUpdate;
}

// core
const HooksDispatcherOnMount = {
  // ...
  useState: mountState,
  // ...
}

const HooksDispatcherOnUpdate = {
  // ...
  useState: updateState,
  // ...
}

const HooksDispatcherOnRerender = {
  // ...
  useState: rerenderState,
  // ...
}

// hooks the knowledges of link-chain
function mountState(initialState) {
  // core
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  // create link-chain node, to recoder the chain information
  const queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState,
    // ...
  };
  hook.queue = queue;
  // TODO: dispatchSetState
  const dispatch = (queue.dispatch = (dispatchSetState.bind(null, currentlyRenderingFiber, queue)))
  return [hook.memoizedState, dispatch];
}

function updateState(initialState) {
  return updateReducer(basicStateReducer, initialState);
}

function rerenderState() {
  return rerenderReducer(basicStateReducer, initialState);
}

// basicStateReducer used by useState
// and the different to useReducer was not use basicStateReducer
function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}


// dispatchSetState
// fiber: currentlyRenderingFiber
// queue: queue
function dispatchSetState(fiber, queue, action) {

}


// ---------------------------------------------
// Key1:currentlyRenderingComponent
// 标记当前组件，每次组件运行时会创建一个新对象
// 作用是什么呢？
// dispatchAction时，会判断是否当前组件触发的操作 componentIdentity === currentlyRenderingComponent
// an update after the function component has returned???
// 
// ---------------------------------------------
// 1. ReactPartialRenderer.js
function resolve() {
  // ...
  processChild();
  // ...
}

function processChild() {
  // Component.prototype && Component.prototype.isReactComponent
  const isClass = shouldConstruct();

  // ...
  if (isClass) {

  } else {
    const componentIdentity = {};
    prepareToUseHooks(componentIdentity);
  }
  // ...
}

// 2. ReactPartialRendererHooks.js
let currentlyRenderingComponent;

function prepareToUseHooks(componentIdentity) {
  currentlyRenderingComponent = componentIdentity;
}
