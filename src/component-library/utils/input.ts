import { RefObject } from 'react';

/**
 * @param {RefObject<HTMLInputElement>}  ref - input ref.
 * @param {string | ReadonlyArray<string> | number} value - value to be included in the event
 * @return {void} - Manually emits onChange event
 */
// TODO: consider moving away from this type of strategy or narrow
// the usage, because it only works on native events and `onPress`
const triggerChangeEvent = (
  ref: RefObject<HTMLInputElement>,
  value: string | ReadonlyArray<string> | number = ''
): void => {
  const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setValue?.call(ref.current, value);

  const e = new Event('input', { bubbles: true });
  ref.current?.dispatchEvent(e);
};

export { triggerChangeEvent };
