// @react-dom
// client.js
// ------ createRoot
// ReactDOM.js
// ------------ createRoot
// ReactDOMRoot.js
// ------------------ createRoot
// ReactFiberReconciler.new.js
// ------------------------ createContainer
// ReactFilberRoot.new.js
// ------------------------------ createFiberRoot

function createRoot() {
  const root = createContainer();
  // ...
  return new ReactDOMRoot(root);
}

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

// ReactFiberReconciler.new.js
function createContainer() {
  return createFiberRoot();
}

// ReactFiberRoot.new.js
function createFiberRoot() {
  const root = new FiberRootNode();
  // ...
  return root;
}

function FiberRootNode() {
  // this.containerInfo = containerInfo;
  // ...
}
