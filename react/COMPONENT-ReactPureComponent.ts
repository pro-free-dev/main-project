// PureComponent & Component is more a attribute of [ isPureReactComponent = true ]

// @react-reconciler
// ReactFiberClassComponent.new.js
function checkShouldComponentUpdate(
  ctor,
  newProps,
  newState,
  oldProps,
  oldState,
  nextContext,
  workInProgress,
) {
  const instance = workInProgress.stateNode;
  if (typeof instance.shouldComponentUpdate === 'function') {
    let shouldUpdate = instance.shouldComponentUpdate(
      newProps,
      newState,
      nextContext,
    );
    return shouldUpdate;
  }

  if (ctor.prototype && ctor.prototype.isPurereactComponent) {
    return (
      !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  }
  return true;
}

function shallowEqual(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const currentkey = keysA[i];
    if (
      !Object.prototype.hasOwnProperty.call(objB, currentkey) ||
      !Object.is(objA, objB)
    ) {
      return false;
    }
  }

  return true;
}

// only excute one when on create the component
function constructClassInstance(workInProgress, ctor, props) {
  // context logics ...
  let context = null;
  // context logics ...

  let instance = new ctor(props, context);
}

const classComponentUpdater = {
  isMounted() {},
  enqueueSetState() {},
  enqueueReplaceState() {},
  enqueueForceUpdate() {},
};

function adoptClassInstance(workInProgress, instance) {
  // bind upder
  //
  instance.updater = classComponentUpdater;
  // save instance
  workInProgress.stateNode = instance;
  setInstance(instance, workInProgress);
}

function mountClassInstance(workInProgress, newProps, ctor) {
  const instance = workInProgress.stateNode;
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;

  // context logic ...
  // instance.context = readContext()|| emptyContextObject|| getMaskedContext()

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps();
    instance.state = workInProgress.memoizedState;
  }

  if (
    typeof instance.UNSAFE_componentWillMount === 'function' ||
    typeof instance.componentWillMount
  ) {
    // 立即触发instance的 componentWillMount 事件
    callComponentWillMount(workInProgress, instance);

    processUpdateQueue(workInProgress, newProps, instance, renderLanes);

    instance.state = workInProgress.memoizedState;
  }

  // 这里只做标记，不触发 componentDidMount
  // 在 ReactFiberCommitWork.new.js 中进行实际调用 safelyCallComponentDidMount()
  if (typeof instance.componentDidMount === 'function') {
  }
}

function callComponentWillMount(workInProgress, instance) {
  if (typeof instance.componentWillMount === 'function') {
    instance.componentWillMount();
  }

  if (typeof instance.UNSAFE_componentWillMount === 'function') {
    instance.UNSAFE_componentWillMount();
  }
}

function resumeMountClassInstance(workInProgress, newProps) {
  const instance = workInProgress.stateNode;
  const oldProps = workInProgress.memoizedProps;
  instance.props = oldProps;

  let nextContext = null; // get next context
  //
  callComponentWillReceiveProps(
    workInProgress,
    instance,
    newProps,
    nextContext,
  );
}

function callComponentWillReceiveProps(
  workInProgress,
  instance,
  newProps,
  nextContext,
) {
  if (typeof instance.componentWillReceiveProps === 'function') {
    instance.componentWillReceiveProps(newProps, nextContext); // next props, next state
  }

  if (typeof instance.UNSAFE_componentWillReceiveProps === 'function') {
    instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
  }
}

export {
  adoptClassInstance, // 将实例挂挂载至 workInProgress
  constructClassInstance, // 构建基础实例 constructClassInstance --> adoptClassInstance
  mountClassInstance, // 触发 componentWillMount
  resumeMountClassInstance, // 触发 componentWillReceviceProps
};

// TODO: getDerivedStateFromProps

// Fiber 调用过程
// ReactFiberWorkLoop.new.js 起始点
// ------ commitRoot
// ------------ commitRootImpl
// ------------------ commitLayoutEffects
// ------------------------ commitLayoutEffects_begin
// ------------------------------ commitLayoutEffects_begin
// ------------------------------------ commitLayoutEffectOnFiber
// ------------------------------------------ instance.componentDidMount
// ------------------------------------------ instance.componentDidUpdate
