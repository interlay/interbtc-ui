import * as React from 'react';

import { InputProps } from '../Input';
import { BaseNumberInput } from './NumberInput.style';

// `onWheel` prop can't be used with `preventDefault` because
// React implements passive event listeners.
const disableChangeOnWheel = (event: MouseEvent) => {
  event.preventDefault();
};

type NumberInputProps = InputProps;

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref): JSX.Element => {
    const inputParent = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      if (!inputParent || !inputParent.current) return;

      const currentInputParent = inputParent.current;

      currentInputParent.addEventListener('wheel', disableChangeOnWheel, { passive: false });

      return () => {
        currentInputParent.removeEventListener('wheel', disableChangeOnWheel);
      };
    }, []);

    return (
      <div ref={inputParent}>
        <BaseNumberInput ref={ref} {...props} />
      </div>
    );
  }
);
NumberInput.displayName = 'NumberInput';

export { NumberInput };
export type { NumberInputProps };
