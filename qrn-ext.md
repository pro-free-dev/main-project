# Source code study `qrn-ext`

name: @qnpm/react-native-ext

version: 4.1.3

## What is it?

QRN-Ext is a extension framework for QRN.

It contains:

- Ext-base: Core, Plugin and Utils
  
- Router: Routes, Context routers and Native-View jump router
  
- Webx: Front-end extention, includes styles and events
  
- Redux: with reducer managment the single dataflow
  

## Source Analysis

```js
// global configuration
Ext.defaults.globalPlugins = ['redux', 'router', 'webx'];

// First initial will apply this function
// TODO: will call this function when new open an RN container?  
Ext._beforeRunApplication = (runApplication) => {
    // ...
}

// The end
export default Ext;
```

### Core

`Ext` was defined by the Core.js and ext.js is extend the `Ext` , add global plugin.

At begining, there is to define some variables.

```js
let defaults = {
    appName: 'native',
    globalPlugins: [],
    navBar: {isShow: false}
}

let Ext = { defaults }

//去掉componentWillMount，componentWillReceiveProps，componentWillUpdate
let LifeCycles = ['componentDidMount', 'componentWillUnmount', 'shouldComponentUpdate', 'componentDidUpdate'];
let EventsFns = ['on', 'off', 'once', 'trigger'];

// protect the variables
let defineStateProperty = (obj, attr, fn) =>{
    Object.defineProperty(obj, attr, {
        get: fn,
        set: _noop // _noop = () => {}
    })
}
defineStateProperty(Ext, 'View', ()=>getCache('View');
defineStateProperty(Ext, 'Component', ()=>getCache('Component');
defineStateProperty(React, 'QView', ()=>getCache('View');
defineStateProperty(React, 'QComponent', ()=>getCache('Component');
defineStateProperty(global, 'QView', ()=>getCache('View');
defineStateProperty(global, 'QComponent', ()=>getCache('Component');

// getCache ---> init() ---> createComponent()
// haha, here is the secrets of the QView and the QComponent.
function createComponent(React, isView){
    class ExtComp extends React.Component {
        constructor(){
        // hooker render
        //  1. load webx plugin before render
        //  2. send event beforeRender
        //  3. render
        //      global.QrnConfig.skeletonEnable 
        //      HOW TO RENDER A SKELETON?
        //          context.renderSkeleton
        //          context.disableRenderSkeleton
        //          global.QrnConfig.skeleton
        //  4. send event afterRender

        // hooker componentDidMount
        //   1. run plugins by defaults.globalPlugins
        //   2. run LifeCycles, there are many important codes in LifeCycles' defenition
        //   3. run context.bindEvents
        //   4. run beforeComponentDidMount
        //   5. componentDidMount
        //   6. run afterComponentDidMount
        //   TODO: 7. here I should be debugging this
        //   7. addNativeEventListener
        //      push event to the nativeListenerMap by rootTag

        // hooker componentWillUnmount
        //   1. remove nativeListenerMap by rootTag
        //   2. componentWillUnmount

        // serView
        // Router, rootTag
        }
    }  
    ExtComp.type = isView ? 'View' : 'Component';
    return ExtComp;
}

Ext.init = init;

// plugin
// restriction 1: name is string only
// added plugin will be trigged at the beigning when componentDidMount excuting 
Ext.addPlugin 

// next defenition the utils
Ext.utils = {
    ////////////////////////////////
}

global.Ext = Ext;

export default Ext;
```

## Plugin Redux

By default the pages using a single store, if there is need a new store, could use `Ext.open('pageName:new')`to open a seperate one.

The issues of my project

1. how does the middleware running
  
2. the difference between open and sendSchem
  

The events of QRN create container

> redux saga run function to move here

1. `createStore() ` excuting reducers, middlewares and dispatch the init action
  
2. `CPage.constructor`
  
3. `Home.constructor`
  
4. `CPage.componentWillMount`
  
5. `Home.componentWillMount`
  
6. `...`
  
7. `Home.componentWillUnMount`
  
8. `CPage.componentWillUnMount`
  

```js
import { connect } from "./plugins/redux/lib/react-redux";

// plugins/redux/lib/index.js
function usingRedux() {
  return Ext.defaults.redux && Ext.defaults.redux.reducer;
}

Ext.addPlugin("redux", noop, noop, (Component, isView, plugins, name) => {
  let options = Component.reduxPlugin;

  if (!usingRedux()) return Component;

  let opts = mergeOpts(options);

  return connect(
    opts.mapStateToProps,
    opts.mapDispatchToProps,
    opts.mergeProps,
    opts.options
  )(Component);
});

// QUNAR Ext loading flow
// 1. Open `RN` container
//    ---> Load Ext
//      ---> App Initialization
//        ---> Ext.defaults = {}
// first time create the RN container's flow
// global.Ext = Ext;
// when variable assignment to global, it can be visited in everywhere
import "@qnpm/react-native-ext";
// app load logic, all kinds of initializations are be done here
// TODO: does here will be running everytime when create the new container?
import "./config/AppLoad";
// configuration Ext.defaults here
import "./config/Ext";

// 2.
// open a new container, examples: Home ---> Area
// by this situation, does the following as same as the first container be created?

/// @ Result
/// by the case `Home ---> Area` willn't be running again.
/// './config/AppLoad' and './config/Ext' are the global variables, only initialization once
/// SO QUANR initilization must to change
/// 1. AppLoad move to `CPage.constructor`
/// 2. saga.run move into saga-middleware/createSagaMiddle()


// REDUX AND REDUX-SAGA
// the relationship by redux and redux-saga
// initialization redux and middleware
function createSagaMiddleware() {
  function sagaMiddleware(store) {
    return (next) => {
      return (action) => {};
    };
  }

  sagaMiddleware.run = function (){}
}

const sagaMiddleware = createSagaMiddleware();
// when `run` is called, the store have already been created
// thus I can move the `run` function into the sagaMiddleware
sagaMiddleware.run(rootSaga);


// ctrip redux and saga workflows, it's fine.
// first
// Home
import rootSaga from './example';
const sagaMiddleware = createSagaMiddleware(); // create by initialization time
global.runSaga = sagaMiddleware.run
const store = createStore(reducer, [sagaMiddleware])

// CPage componentWillMount
if(!__appLoaded){
  global.runSaga(rootSaga);
}

// second
// Home ---> List (Open a new container)
import rootSaga from './example';
// so the problem is here will be running again when the List container is created?
// if YES, it will as well as CTRIP
// if NO, global.runSage = Home.sagaMiddleware
//  --->  ANSWER: `createSagaMiddleware` willn't running again
const sagaMiddleware = createSagaMiddleware(); 
const store = createStore(reducer, [sagaMiddleware])
global.runSaga = sagaMiddleware.run

// CPage componentWillMount
if(!__appLoaded){
  // Home.store binded the List.saga middlewares, so used a newEnv to change the store reference
  // saga middleware holds the store reference, there are some errors here
  //  ---> 
  global.runSaga(rootSaga); 
}

// QUNAR redux and saga workflows, it does OK

```
