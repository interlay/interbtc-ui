import { useNumberField } from '@react-aria/numberfield';
import { chain, mergeProps } from '@react-aria/utils';
import type { NumberFieldStateProps } from '@react-stately/numberfield';
import { useNumberFieldState } from '@react-stately/numberfield';
import * as React from 'react';

import { useDOMRef } from '@/component-library/utils/dom';

import { Input, InputProps } from '../Input';

// Prevents the user from changing the input value using mouse wheel
const handleWheel = (event: WheelEvent) => event.preventDefault();

// Format options for react-stately
const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 20 };

// Static locale for react-stately
// TODO: To be replaced when we manage our locales
const locale = 'en-US';

type Props = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

type InheritAttrs = Omit<InputProps, keyof Props>;

type AriaAttrs = Omit<NumberFieldStateProps, (keyof Props & keyof InheritAttrs) | 'locale'>;

type NumberInputProps = Props & InheritAttrs & AriaAttrs;

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

    // TODO: should move props into <FormField/> when added here as a wrapper
    return <Input {...mergeProps(props, inputProps)} onChange={handleChange} ref={inputRef} />;
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
export type { NumberInputProps };
