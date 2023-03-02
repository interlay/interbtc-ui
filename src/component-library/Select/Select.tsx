import { useField } from '@react-aria/label';
import { useSelect } from '@react-aria/select';
import { chain, mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { SelectProps as AriaSelectProps, useSelectState } from '@react-stately/select';
import { CollectionBase, Node } from '@react-types/shared';
import { forwardRef, Key, useRef } from 'react';

import { Field, FieldProps, useFieldProps } from '../Field';
import { hasErrorMessage } from '../HelperText/HelperText';
import { useDOMRef } from '../utils/dom';
import { triggerChangeEvent } from '../utils/input';
import { Sizes } from '../utils/prop-types';
import { SelectModal } from './SelectModal';
import { SelectTrigger } from './SelectTrigger';

// TODO: listbox to be implemented
type Props = {
  type?: 'listbox' | 'modal';
  open?: boolean;
  loading?: boolean;
  size?: Sizes;
  // MEMO: Allows a custom select trigger (TokenInput select)
  asSelectTrigger?: any;
  customRender?: (item: Node<any>) => JSX.Element;
};

type InheritAttrs<T = any> = Omit<
  CollectionBase<T> & FieldProps & AriaSelectProps<T>,
  keyof Props | 'isDisabled' | 'isLoading' | 'isOpen' | 'isRequired'
>;

type NativeAttrs = Omit<React.InputHTMLAttributes<Element>, keyof Props>;

type SelectProps = Props & NativeAttrs & InheritAttrs;

const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      type = 'listbox',
      name,
      disabled,
      loading,
      open,
      required,
      label,
      errorMessage,
      size = 'medium',
      onChange,
      placeholder = 'Select an option',
      asSelectTrigger,
      onSelectionChange,
      customRender = (item) => item.rendered,
      ...props
    },
    ref
  ): JSX.Element => {
    const inputRef = useDOMRef(ref);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const ariaProps: AriaSelectProps<any> = {
      isDisabled: disabled,
      isLoading: loading,
      isOpen: open,
      isRequired: required,
      onSelectionChange: chain((key: Key) => triggerChangeEvent(inputRef, key), onSelectionChange),
      onOpenChange: (isOpen) => {
        return isOpen ? buttonRef.current?.blur() : buttonRef.current?.focus();
      },
      label,
      errorMessage,
      placeholder,
      ...props
    };

    const state = useSelectState(ariaProps);

    // MEMO: `menuProps` and `triggerProps` not implemented yet
    const { labelProps, valueProps, triggerProps, descriptionProps, errorMessageProps } = useSelect(
      ariaProps,
      state,
      buttonRef
    );

    const { fieldProps, elementProps } = useFieldProps({
      ...props,
      descriptionProps,
      errorMessageProps,
      errorMessage,
      labelProps: mergeProps(labelProps, props.labelProps || {}),
      label
    });

    const hasError = hasErrorMessage(errorMessage);

    const selectTriggerProps =
      type === 'listbox'
        ? triggerProps
        : mergeProps(props, {
            onPress: () => {
              // buttonRef.current?.blur();
              state.setOpen(true);
            },
            id: triggerProps.id,
            'aria-labelledby': triggerProps['aria-labelledby']
          });

    const { fieldProps: hiddenFieldProps, labelProps: hiddenLabelProps } = useField({ label });

    return (
      <Field {...fieldProps}>
        <VisuallyHidden>
          <label {...hiddenLabelProps}>{label}</label>
          <input
            ref={inputRef}
            name={name}
            disabled={disabled}
            value={onChange ? state.selectedItem?.textValue || '' : undefined}
            onChange={onChange}
            tabIndex={-1}
            {...hiddenFieldProps}
          />
        </VisuallyHidden>
        <SelectTrigger
          {...mergeProps(elementProps, selectTriggerProps)}
          as={asSelectTrigger}
          ref={buttonRef}
          size={size}
          hasError={hasError}
          valueProps={valueProps}
          placeholder={placeholder}
        >
          {state.selectedItem && customRender(state.selectedItem)}
        </SelectTrigger>
        {type === 'modal' && (
          <SelectModal
            isOpen={state.isOpen}
            state={state}
            onClose={state.close}
            selectedAccount={state.selectedItem?.key}
          />
        )}
      </Field>
    );
  }
);

Select.displayName = 'Select';

export { Select };
export type { SelectProps };
