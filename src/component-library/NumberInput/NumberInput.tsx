import { useNumberField } from '@react-aria/numberfield';
import { chain, mergeProps } from '@react-aria/utils';
import type { NumberFieldStateProps } from '@react-stately/numberfield';
import { useNumberFieldState } from '@react-stately/numberfield';
import * as React from 'react';

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

type AriaAttrs = Omit<NumberFieldStateProps, (keyof Props & InheritAttrs) | 'locale'>;

type NumberInputProps = Props & InheritAttrs & AriaAttrs;

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ onChange, ...props }, ref: any): JSX.Element => {
    const inputRef = React.useRef<HTMLInputElement>(null);
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
    console.log(props);
    // TODO: should move props into <FormField/> when added here as a wrapper
    return (
      <Input
        {...mergeProps(props, inputProps)}
        onChange={handleChange}
        ref={(e) => {
          (inputRef as any).current = e;
          console.log(ref);
          console.log(e);
          ref(e);
        }}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
export type { NumberInputProps };
