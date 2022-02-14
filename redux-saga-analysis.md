# redux-saga 源码分析

项目中使用到了`redux-saga`，看着文档各种`generator`和`helpers`函数一头雾水，为加深自己的理解，因而觉得有必要深入源码，了解下它的实现方式。

先看概览图，看一看它的全貌，本文主要从以下三部分进行分析：
1. `sagaMiddleware`
2. `runSaga`
3. `sagaHelpers`

<img src='https://user-images.githubusercontent.com/13233825/146486378-9c45dc55-2b65-4c65-9c8f-cdd1ff7fc26e.png' width='800px'>


## 1.sagaMiddleware
官方文档中，引入`saga`中间件，示意代码如下：

```js
// ...
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

// ...
import { helloSaga } from './sagas'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(helloSaga)

const action = type => store.dispatch({type})

// rest unchanged
```




`const sagaMiddleware = createSagaMiddleware()` 这行代码，是中间件的引入，一切从这里开始。它是`sagaMiddlewareFactory`函数的返回对象，并且在返回前给`sagaMiddleware`挂载了`runSaga`方法。`sagaMiddlewareFactory`里做了以下3件事情：
1. 定义sagaMiddleware函数，并且返回这个函数
2. sagaMiddleware.run，添加`run`函数，用于将`generator`函数添加channel和forkQueue中，在后续dispatch时响应函数
3. sagaMiddleware.setContext，**TODO: 没有使用到，未研究**

### `sagaMiddleware`函数
直接贴上这个函数的代码，解释直接写在注释中
```js
function sagaMiddleware({ getState, dispatch }) {
    // 将 runSaga 函数指向函数变量 boundRunSaga
    // null: this为函数runSaga自身
    // {}: 绑定参数
    boundRunSaga = runSaga.bind(null, {
      ...options,
      context,
      channel,
      dispatch,
      getState,
      sagaMonitor,
    })

    // 标准的 redux 中间件函数写法
    return next => action => {
      if (sagaMonitor && sagaMonitor.actionDispatched) {
        sagaMonitor.actionDispatched(action)
      }
      const result = next(action) // hit reducers

      // 从这里可以看到，是在reducer之后才会触发saga监听的action
      // 问题1：如果reducer中改变了数据，而saga函数中想获得改变前的数据时，如何获取呢？
      // 问题2：channel 什么时候赋值的呢？
      channel.put(action)
      return result
    }
  }
```

> 问题1：如果reducer中改变了数据，而saga函数中想获得改变前的数据时，如何获取呢？
- 方法1：可以将修改state的代码放入saga函数中，reducer里只做返回新数据对象。比较推荐这种写法，可以将业务代码都限定在saga中。
- 方法2：自己实现中间件，将数据保存在action或context中。
> 问题2：channel 什么时候赋值的呢？
- runSaga中会将监听的action添加至channel中

## 2.runSaga
```js
// run: 是上面的 boundRunSaga 函数，是sagaMiddleware返回时挂载的上来的
// helloSaga: 业务逻辑中写的generator函数
sagaMiddleware.run(helloSaga)

// runSga函数在源码的 ./src/internal/runSaga.js 文件中
```

下面还是贴源码加注释的方式进行解读，对源码进行了部分删减，我们关注核心部分，即`runSaga`做了哪些事情
```jsx
// 入参有三个
// 参数1：sagaMiddlewareFactory中bindRunSaga时已经赋值，都是一些默认参数，也可以自定义传入
// 参数2：核心，我们写的saga函数
// 参数3：说明在run(saga,...otherArguments)时我们还可以传入 otherArguments 其他参数
export function runSaga(
  { channel = stdChannel(), dispatch, getState, context = {}, sagaMonitor, effectMiddlewares, onError = logError },
  saga,
  ...args
) {

  // 核心：saga对应的是rootSaga函数，也就是我们的业务saga的入口
  // rootSaga {<suspended>}
  //   [[GeneratorLocation]]: VM155:1
  //   [[Prototype]]: Generator
  //   [[GeneratorState]]: "suspended"
  //   [[GeneratorFunction]]: ƒ* rootSaga()
  //   [[GeneratorReceiver]]: Window
  //   [[Scopes]]: Scopes[2]
  const iterator = saga(...args)

  // 这里如果没有传入effectMiddlewares，那么这个函数执行的是他本身
  // 默认就是执行原函数
  // export const identity = v => v
  let finalizeRunEffect
  if (effectMiddlewares) {
    const middleware = compose(...effectMiddlewares)
    finalizeRunEffect = runEffect => {
      return (effect, effectId, currCb) => {
        const plainRunEffect = eff => runEffect(eff, effectId, currCb)
        return middleware(plainRunEffect)(effect)
      }
    }
  } else {
    finalizeRunEffect = identity
  }

  // channel: 我们写的saga函数是一个task，channel是管理这些task的列表
  // wrapSagaDispatch 的作用是在action上添加 saga 标签，用来判断当前是支持
  // return dispatch(Object.defineProperty(action, SAGA_ACTION, { value: true }))
  // TODO：待理解SAGA_ACTION的作用
  const env = {
    channel,
    dispatch: wrapSagaDispatch(dispatch),
    getState,
    sagaMonitor,
    onError,
    finalizeRunEffect,
  }

  return immediately(() => {
    // 执行 iterator
    // isRoot = true --> type:"ALL"
    const task = proc(env, iterator, context, effectId, getMetaInfo(saga), /* isRoot */ true, undefined)
    return task
  })
```


### 2.1 proc
这个函数比较复杂，也是saga启动的核心，需要深入分析。

1. `newTask` 创建task对象，此时创建一个父任务
   1. `forkQueue` 包含 父任务、主任务、分叉任务，它是一个树形结构 
   
2. `next` 启动generator，执行next直到`done=true`。这里的`next`是一个递归处理，我们一步步来看：
   1. `result = iterator.next(arg)`执行generator函数，此时result返回一个对象，包含value和done两个key。`value`即为我们saga函数的列表，`done=false`
   2. 当 `!result.done`时触发`digestEffect(result.value, parentEffectId, next)`，`digestEffect`对第三个参数`next`挂载cancel方法后，调用`runEffect`。
   3. `runEffect`对入参进行判断，
      1. `is.promise`则执行`resolvePromise`
      2. `is.iterator`则执行`proc`
      3. `effect[IO]`则执行`effectRunnerMap[IO]`，当前执行的是`runAllEffect`函数，对所有saga generator进行循环执行。
         1. `runAllEffect`执行的逻辑是通过 `forEach`去调用`digestEffect(effects[key], effectId, childCallbacks[key], key)`，实际执行的就是`runEffect`
      4. `currCb(effect)`

我们接着看`runAllEffect`这个函数的执行逻辑。`keys`就是rootSaga中的function，`keys.forEach`是循环执行每一个saga generator，并且存放到前面提到的`mainTask`任务数组中去。
```js
function runAllEffect(env, effects, cb, { digestEffect }) {
  const effectId = currentEffectId
  // effects 就是 rootSagas 数组对象
  const keys = Object.keys(effects)
  if (keys.length === 0) {
    cb(is.array(effects) ? [] : {})
    return
  }

  const childCallbacks = createAllStyleChildCallbacks(effects, cb)
  keys.forEach(key => {
    // 执行的就是 runEffect
    digestEffect(effects[key], effectId, childCallbacks[key], key)
  })
}
```

这里说明几个effect的执行顺序
1. run(rootSaga)时首先执行`runAllEffect`，这里对每一个saga函数循环进行处理。
2. `takeEvery`会分解成`fork`和`take`两个task。
   1. `fork` 会通过`parent.queue.addTask`将子task添加至父task的queue中
   2. `take` 会通过`channel.take`将`cb(input)`放入`channel`对象中。这里是实际的saga函数，redux触发action后触发`channel.put(action)`，整个流程监听的起点就在这里。这里的`channel --> env.channel`是runSaga函数中初始化的`channel`全局对象。
   3. `fork`的任务什么时候被触发的？当`next()`函数循环执行`generator`函数到`done`状态时，会执行`mainTask.cont(result.value)`，而`cont`对应的会执行到`newTask`的`end`方法。

**newTask.end()**
```js
  task.cont(result, isErr)
    task.joiners.forEach(joiner => {
      joiner.cb(result, isErr)
    }).forEach(key => {
    // 执行的就是 runEffect
    digestEffect(effects[key], effectId, childCallbacks[key], key)
  })
}
```
到这里`saga`中间件的`middleWares`和`runSaga`部分已经讲完，对注入saga函数和监听触发也清楚了其运行方式。代码分析下来，其中主要时各种回调看起来比较绕。核心函数`proc`需要通过添加`log`和断点的方式进行信息查看，有上下文数据理解起来会比较清晰。`channel.put(action)`触发`task`这里比较容易理解。但对于`takeEvery`等任务是如何实现循环监听的，就需要进一步分析`sagaHelpers`库，对它们进行解读和调试，了解其运行的原理。


## 3.sagaHelpers
sagaHelpers提供了实用的函数，能帮助我们简化代码。`takeLatest`适用于网络请求多次发送时，主动取消前一次的请求，使用最新请求参数得到的接口响应来渲染页面。业务代码不用再去判断请求和响应是否对应。`takeEvery`是最常用的saga函数，写业务代码时，需要监听某个`action`这时就会用到它。

```js
export { default as takeEveryHelper } from './takeEvery'
export { default as takeLatestHelper } from './takeLatest'
export { default as takeLeadingHelper } from './takeLeading'
export { default as throttleHelper } from './throttle'
export { default as retryHelper } from './retry'
export { default as debounceHelper } from './debounce'
```

下面来分析`takeEvery`的实现：
- `take` 是一个task，执行match的action，take状态执行到done时，监听流转到yFork
- `yFork` 是一个监听，监听到匹配的action时，触发yTake
- q1 和 q2 return中的nextState是一个循环，它的执行顺序是这样的：q1 --> q2 --> q1 ...
- 
```js
export default function takeEvery(patternOrChannel, worker, ...args) {
  // take 是一个task，执行match的action，take状态执行到done时，监听流转到yFork
  const yTake = { done: false, value: take(patternOrChannel) }
  // yFork 是一个监听，监听到匹配的action时，触发yTake
  const yFork = ac => ({ done: false, value: fork(worker, ...args, ac) })

  let action,
    setAction = ac => (action = ac)

    // q1 和 q2 return中的nextState是一个循环
    // 它的执行顺序是这样的：q1 --> q2 --> q1 ...
  return fsmIterator(
    {
      q1() {
        return { nextState: 'q2', effect: yTake, stateUpdater: setAction }
      },
      q2() {
        return { nextState: 'q1', effect: yFork(action) }
      },
    },
    'q1', // 默认执行任务q1
    `takeEvery(${safeName(patternOrChannel)}, ${worker.name})`,
  )
}
```

## 小结
- 2021/12/17 源码分析部分就到这，`takeLatest`的源码有空再补充上来。
