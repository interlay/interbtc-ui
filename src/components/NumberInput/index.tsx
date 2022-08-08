import * as React from 'react';

import InterlayInput, { Props as InterlayInputProps } from '@/components/UI/InterlayInput';

// `onWheel` prop can't be used with `preventDefault` because
// React implements passive event listeners.
const disableChangeOnWheel = (event: MouseEvent) => {
  event.preventDefault();
};

const NumberInput = React.forwardRef<HTMLInputElement, Props>(
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
        <InterlayInput
          ref={ref}
          type='number'
          step='any'
          pattern='[-+]?[0-9]*[.,]?[0-9]+'
          placeholder='0.00'
          spellCheck='false'
          {...props}
        />
      </div>
    );
  }
);
NumberInput.displayName = 'NumberInput';

export type Props = InterlayInputProps;

export default NumberInput;
