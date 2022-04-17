function shouldCaptureSuspense(workInProgress, hasInvisibleParent) {
  const nextState = workInProgress.memoizedState;
  if (nextState !== null) {
    if (nextState.dehydrated !== null) {
      // A dehydrated boundary always captures
      return true;
    }
    return false;
  }

  const props = workInProgress.memoizedProps;

  // Enables unstable_avoidThisFallback feature in Fiber
  const enableSuspenseAvoidThisFallback = false;
  if (
    !enableSuspenseAvoidThisFallback ||
    props.unstable_avoidThisFallback !== true
  ) {
    return true;
  }

  // If it's a boundary we should avoid, then we prefer to bubble up to the
  // parent boundary it it is  currently invisible.
  if (hasInvisibleParent) {
    return false;
  }

  return true;
}

// ReactWorkTags.js
const SuspenseComponent = 13;

function findFirstSuspended(row) {
  let node = row;
  while (node !== null) {
    if (node.tag === SuspenseComponent) {
      const state = node.memoizedState;
      if (state !== null) {
        const dehydrated = state.dehydrated;
        if (
          dehydrated === null ||
          isSuspenseInstancePending(dehydrated) ||
          isSuspenseInstanceFallback(dehydrated)
        ) {
          return node;
        }
      }
    } else if (
      node.tag === SuspenseComponent &&
      node.memoizedProps.revealOrder !== undefined
    ) {
      const didSuspend = (node.flags & DidCapture) !== NoFlags;
      if (didSuspend) {
        return node;
      }
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === row) {
      return null;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === row) {
        return null;
      }
      node = node.return;
    }
    node.sibling.return = node;
    node = node.sibling;
  }
  return null;
}
