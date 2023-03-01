import { useSelect } from '@react-aria/select';
import { chain, mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useSelectState } from '@react-stately/select';
import { CollectionBase } from '@react-types/shared';
import { forwardRef, Key, useRef } from 'react';

import { Field, FieldProps, useFieldProps } from '../Field';
import { hasErrorMessage } from '../HelperText/HelperText';
import { useDOMRef } from '../utils/dom';
import { Sizes } from '../utils/prop-types';
import { SelectModal } from './SelectModal';
import { SelectTrigger } from './SelectTrigger';

type Props = {
  open?: boolean;
  loading?: boolean;
  size?: Sizes;
};

type InheritAttrs<T = any> = Omit<CollectionBase<T> & FieldProps, keyof Props>;

type NativeAttrs = Omit<React.InputHTMLAttributes<Element>, keyof Props>;

type SelectProps = Props & NativeAttrs & InheritAttrs;

const Select = forwardRef<HTMLInputElement, SelectProps>(
  (props, ref): JSX.Element => {
    const { name, disabled, loading, open, required, label, errorMessage, size = 'medium', onChange, ...rest } = props;

    const inputRef = useDOMRef(ref);

    const handleSelectionChange = (key: Key) => {
      const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      setValue?.call(inputRef.current, key);

      const e = new Event('input', { bubbles: true });
      inputRef.current?.dispatchEvent(e);
    };

    const ariaProps = {
      isDisabled: disabled,
      isLoading: loading,
      isOpen: open,
      isRequired: required,
      name,
      ...rest
    };

    const state = useSelectState({ ...ariaProps, onSelectionChange: handleSelectionChange });

    const buttonRef = useRef<HTMLButtonElement>(null);

    // MEMO: `menuProps` and `triggerProps` not implemented yet
    const { labelProps, valueProps, descriptionProps, errorMessageProps } = useSelect(ariaProps, state, buttonRef);

    const { fieldProps, elementProps } = useFieldProps({
      ...rest,
      descriptionProps,
      errorMessageProps,
      errorMessage,
      labelProps,
      label
    });

    const hasError = hasErrorMessage(errorMessage);

    return (
      <Field {...fieldProps}>
        <VisuallyHidden>
          <input
            ref={inputRef}
            name={name}
            disabled={disabled}
            value={state.selectedItem?.textValue || ''}
            onChange={onChange}
            // onFocus={() => buttonRef.current?.focus()}
            tabIndex={-1}
          />
        </VisuallyHidden>
        <SelectTrigger
          {...mergeProps(elementProps, {
            onPress: () => {
              state.setOpen(true);
              buttonRef.current?.blur();
            }
          })}
          ref={buttonRef}
          size={size}
          valueProps={valueProps}
          hasError={hasError}
          placeholder='Select an option'
        >
          {state.selectedItem && state.selectedItem.rendered}
        </SelectTrigger>
        <SelectModal
          isOpen={state.isOpen}
          state={state}
          onClose={state.close}
          selectedAccount={state.selectedItem?.key}
          onSelectionChange={chain(handleSelectionChange, state.close)}
        />
      </Field>
    );
  }
);

Select.displayName = 'Select';

export { Select };
export type { SelectProps };
