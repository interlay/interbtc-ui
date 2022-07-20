import { useNumberField } from '@react-aria/numberfield';
import { mergeProps } from '@react-aria/utils';
import type { NumberFieldStateProps } from '@react-stately/numberfield';
import { useNumberFieldState } from '@react-stately/numberfield';
import * as React from 'react';

import { chain } from '@/component-library/utils/chain';
import { useDOMRef } from '@/component-library/utils/dom';

import { BaseNumberInput } from './NumberInput.style';

// Prevents the user from changing the input value using mouse wheel
const handleWheel = (e: WheelEvent) => e.preventDefault();

// Format options for react-stately
const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 20 };

// Static locale for react-stately
// TODO: To be replaced when we manage our locales
const locale = 'en-US';

type Props = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

type InheritAttrs = Omit<NumberFieldStateProps, keyof Props>;

type NumberInputProps = Props & InheritAttrs;

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ onChange, ...props }, ref): JSX.Element => {
    const inputRef = useDOMRef(ref);
    const state = useNumberFieldState({
      ...props,
      locale,
      formatOptions
    });
    const { inputProps } = useNumberField(props, state, inputRef);

    React.useEffect(() => {
      const input = inputRef.current;

      input?.addEventListener('wheel', handleWheel, { passive: false });

      return () => input?.removeEventListener('wheel', handleWheel);
    }, [inputRef]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = chain(inputProps.onChange, onChange);

    return <BaseNumberInput {...mergeProps(props, inputProps)} onChange={handleChange} ref={inputRef} />;
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
export type { NumberInputProps };
