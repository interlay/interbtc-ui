import { MutableRefObject, RefObject } from 'react';

/**
 * @param {RefObject<HTMLInputElement>}  ref - input ref.
 * @param {string | ReadonlyArray<string> | number} value - value to be included in the event
 * @return {void} - Manually emits onChange event
 */
const triggerChangeEvent = (
  ref: RefObject<HTMLInputElement>,
  value: string | ReadonlyArray<string> | number = ''
): void => {
  const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setValue?.call(ref.current, value);

  const e = new Event('input', { bubbles: true });
  ref.current?.dispatchEvent(e);
};

const assignFormRef = (
  formRef?: (instance: any) => void,
  domRef?: MutableRefObject<HTMLInputElement | null>,
  cb?: any
) => (el: HTMLInputElement | null): void => {
  formRef?.(el);

  if (domRef) {
    domRef.current = el;

    cb?.(domRef);
  }
};

export { assignFormRef, triggerChangeEvent };
