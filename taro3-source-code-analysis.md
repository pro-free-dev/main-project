
# 源码解析
`Version: 3.3.12`

###
taro-weapp

taro-qq

taro-xxx

每各端通过插件的方式提供, 各端提供统一的接口方法. 
## shared
Taro 内部使用的 utils。包含了常用的类型判断、错误断言、组件类型/声明/参数等。`@tarojs/shared` 会跨 node/浏览器/小程序/React Native 使用，不得使用平台特有特性。
- `processApis` native-api.ts 它将**平台**所有的`eg:微信原生` API 进行二次封装，然后挂载在 Taro 对象中。
- `template` 用于模板生成 `buildTemplate`

## taro-runtime
Taro 运行时。在小程序端连接框架（DSL）渲染机制到小程序渲染机制，连接小程序路由和生命周期到框架对应的生命周期。在 H5/RN 端连接小程序生命周期**规范**到框架生命周期。
- `current` 当前实例
  - app
  - router
  - page
- `hydrate`  * it's a vnode traverser and modifier: that's exactly what Taro's doing in here.
  - `static node` is pure-view?
  - `dataset`
- `hooks`
  - `initNativeApi` 挂载属性或 API 到 Taro 对象上
  - `getLifecycle` 解决 React 生命周期名称的兼容问题
  - `getEventCenter` 解决支付宝小程序分包时全局作用域不一致的问题
  - `modifyMpEvent` 用于修改小程序原生事件对象
  - `modifyTaroEvent` 用于修改 Taro DOM 事件对象
  - `inversify` @injectable(), @inject()
- `dsl` Domain Specific Language
    - `hooks` taroHooks
    - `react`
      - `createReactApp`
      - `ReactDOM.render`
      - `setReconciler`
    - `Vue`
    - `Vue3`
- `dom`
- `bom`
  - `window`
  - `document`
  - `nqvigator`
- `polyfill` reflect-metadata

## taro-loader
taro-loader

## taro-api
运行时Taro对象
```js
export default Taro
```
- `env` getEnv() weapp | web | rn
- `tools` px transform to rpx
- `polyfill` Object.defineProperties
- `interceptor` 
  - `chain`
  - `Link`
  - `interceptors` loggerInterceptor, timeoutInterceptor
