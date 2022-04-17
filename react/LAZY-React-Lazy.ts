type LazyComponent<T, P> = {
  $$typeof: Symbol | number;
  _playload: T;
  _init: (playload: T) => P;
};

const REACT_LAZY_TYPE = Symbol.for('react.lazy');

function lazyInitializer(payload) {
  if (payload._status === 'Uninitialized') {
    const ctor = payload._result;
    const thenable = ctor();

    thenable.then(moduleObject => {});
  }
  if (payload._status === 'Resolved') {
  }
}

export function lazy<T>(ctor: Promise<T>) {
  const playload = {
    _status: 'Uninitialized',
    _result: ctor,
  };

  const lazyType: LazyComponent<any, any> = {
    $$typeof: REACT_LAZY_TYPE,
    _playload: playload,
    _init: lazyInitializer,
  };

  return lazyType;
}

// ReactChildFiber.new.js
// load lazy component

function sampleCode(elementType) {
  if (elementType.$$typeof === REACT_LAZY_TYPE) {
    resolveLazy(elementType);
  }
}
function resolveLazy(lazyType) {
  const payload = lazyType._payload;
  const init = lazyType._init;
  return init(payload);
}
