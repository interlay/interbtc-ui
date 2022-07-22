import { Ref, RefObject, useImperativeHandle, useRef } from 'react';

// Points parent ref passed as argument (forwardRef) to the children ref
export function useDOMRef<T extends HTMLElement = HTMLElement>(ref: RefObject<T | null> | Ref<T | null>): RefObject<T> {
  const domRef = useRef<T>(null);
  useImperativeHandle(ref, () => domRef.current);
  return domRef;
}
