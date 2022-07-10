# Axios source code analysis
> Date: Jul 10 2022
> 
> A hot sunday afternoon


```js
// beginning
const axios = createInstance(default)

export default axios;

```

Then there will be the main entrance function `createInstance` lets see what have the function do?
```js
function createInstance(defaultConfig){
  const context = new Axios(default); // oops, what does here do? --> core/Axios
  const instance = bind(Axios.prototype.request, context)
  
  // extends ...
  return instance
}

// lib/core/Axios.js
class Axios{
  request(){} // get method is the default
  
  getUri(config){
  }
}

// setting other methods
// 'post', 'put', 'patch'
Axios.prototype[method] = generateHTTPMethod();

Axios.prototype[method + 'Form'] = generateHTTPMethod(true);

export default Axios
```
