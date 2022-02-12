### Suspense

##### React 16.6    
_Suspense_ & _code split_

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

render(ChildComp) --> Promise(Fetch) --> Promise(throw Error) --> Suspense(componentDidCatch) --> render(Loading)

Suspense(Promise.then) --> setState, render(children) 

render(ChildComp) --> Promise(Fetch) --> Sync Result --> render


```
![image](https://user-images.githubusercontent.com/13233825/153697499-238f1e2b-ccf2-48b3-a39e-e864f682ab8c.png)
