

# taro-h5
`Version: 3.3.12`

- taro-h5 运行原理
- taro-h5 ssr实现

## taro-h5 运行原理
Taro3 的 H5 端组件库基于 `Web Components`，使用了 Stencil 框架进行开发。
- `taro-view-core`
- `taro-image-core`
- `taro-text-core`
- 
主要实现模拟小程序的功能，选择图片、定位、Storage
- `@tarojs/router`
- `api`
  - `location` **chooseLocation** map.qq.com
  - `window` **onWindowResize**
  - `Storage`
