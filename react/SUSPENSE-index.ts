export const REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
export const REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');

// @react
// react.js
// Suspense is just a identify
export {
  REACT_SUSPENSE_TYPE as Suspense,
  REACT_SUSPENSE_LIST_TYPE as SuspenseList,
};

// ReactFiber.new.js
export function createFiberFromSuspense() {
  const fiber = createFiber(SuspenseComponent, pendingProps, key, mode);
  fiber.elementType = 'REACT_SUSPENSE_TYPE';
  return fiber;
}

// @react-cache
// Core ReactCacheOld.js

const Pending = 0;
const Resolved = 1;
const Rejected = 2;

export function unstable_createResource(fetch: Promise<any>, maybeHashInput) {
  const resource = {
    read() {
      const result: any = accessResult();
      switch (result.status) {
        case Pending: {
          const suspender = result.value;
          throw suspender;
        }
        case Resolved: {
          const value = result.value;
          return value;
        }
        case Rejected: {
          const error = result.value;
          throw error;
        }
        default:
          return undefined;
      }
    },
    // preload() {
    //   //
    //   accessResult(),
    // }
  };

  return resource;
}

// react lru cache
function accessResult() {
  // logics ...
}

// Suspense Process
// ------ createResource.read (from react-cache)
// ------------ throw suspender
// ------------------ SuspenseComponent --> show fallback component
// ------------------------ Promise.then()
// ------------------------------ rerender ChildComponent

// const createResource = unstable_createResource(fetch);

// function ChildComponent() {
//   return (
//     <View>
//       <Text>createResource.read()</Text>
//     <View/>
//     );
// }

// <Suspense>
//   <ChildComponet></ChildComponet>
// </Suspense>;

// Question 1: How does SuspenseComponent mapping to Suspense?
