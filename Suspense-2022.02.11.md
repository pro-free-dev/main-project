### Suspense

##### React 16.6    
- Suspense
- react-cache


> 用同步的方法写异步
> 
1. 异步加载代码
2. 异步加载数据



##### Fiber
- Schdule
- Render
- Commit

##### Suspense 加载流程
```jsx

render(Todo) --> Promise(Fetch) --> Promise(throw Error) --> Suspense(componentDidCatch) --> render(Loading)

Suspense(Promise.then) --> setState, render(children) 

render(Todo) --> Promise(Fetch) --> Sync Result --> render


```
![image](https://user-images.githubusercontent.com/13233825/153697499-238f1e2b-ccf2-48b3-a39e-e864f682ab8c.png)
