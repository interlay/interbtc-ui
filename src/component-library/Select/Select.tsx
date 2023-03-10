import { useSelect } from '@react-aria/select';
import { chain, mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { SelectProps as AriaSelectProps, useSelectState } from '@react-stately/select';
import { CollectionBase, Node } from '@react-types/shared';
import { ForwardedRef, forwardRef, Key, ReactNode, useRef } from 'react';

import { Field, FieldProps, useFieldProps } from '../Field';
import { useDOMRef } from '../utils/dom';
import { hasError, triggerChangeEvent } from '../utils/input';
import { Sizes } from '../utils/prop-types';
import { SelectModal } from './SelectModal';
import { SelectTrigger } from './SelectTrigger';

type SelectObject = Record<string, unknown>;

// TODO: listbox to be implemented
type Props<T extends SelectObject> = {
  type?: 'listbox' | 'modal';
  open?: boolean;
  loading?: boolean;
  size?: Sizes;
  // MEMO: Allows a custom select trigger (TokenInput select)
  asSelectTrigger?: any;
  renderValue?: (item: Node<T>) => ReactNode;
  placeholder?: ReactNode;
  modalTitle?: ReactNode;
};

type InheritAttrs<T extends SelectObject = any> = Omit<
  CollectionBase<T> & FieldProps & AriaSelectProps<T>,
  keyof Props<T> | 'isDisabled' | 'isLoading' | 'isOpen' | 'isRequired' | 'selectedKey' | 'defaultSelectedKey'
>;

type NativeAttrs<T extends SelectObject> = Omit<React.InputHTMLAttributes<Element>, keyof Props<T>>;

type SelectProps<T extends SelectObject> = Props<T> & NativeAttrs<T> & InheritAttrs<T>;

const Select = <T extends SelectObject>(
  {
    value,
    defaultValue,
    type = 'listbox',
    name,
    disabled,
    loading,
    open,
    required,
    label,
    errorMessage,
    size = 'medium',
    placeholder = 'Select an option',
    asSelectTrigger,
    modalTitle,
    validationState,
    onChange,
    onSelectionChange,
    renderValue = (item) => item.rendered,
    ...props
  }: SelectProps<T>,
  ref: ForwardedRef<HTMLInputElement>
): JSX.Element => {
  const inputRef = useDOMRef(ref);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const ariaProps: AriaSelectProps<T> = {
    isDisabled: disabled,
    isLoading: loading,
    isOpen: open,
    isRequired: required,
    selectedKey: value as Key,
    defaultSelectedKey: defaultValue as Key,
    label,
    errorMessage,
    validationState,
    onSelectionChange: chain((key: Key) => triggerChangeEvent(inputRef, key), onSelectionChange),
    ...props
  };

  const state = useSelectState(ariaProps);

  // MEMO: `menuProps` and `triggerProps` not implemented yet
  const { labelProps, valueProps, triggerProps, descriptionProps, errorMessageProps } = useSelect(
    ariaProps,
    state,
    buttonRef
  );

  const { fieldProps, elementProps } = useFieldProps(
    mergeProps(props, {
      descriptionProps: mergeProps(descriptionProps, props.descriptionProps || {}),
      errorMessageProps: mergeProps(errorMessageProps, props.errorMessageProps || {}),
      errorMessage,
      labelProps: mergeProps(labelProps, props.labelProps || {}),
      label
    })
  );

  const error = hasError({ errorMessage, validationState });

  const selectTriggerProps =
    type === 'listbox'
      ? triggerProps
      : mergeProps(props, {
          onPress: () => state.setOpen(true),
          disabled,
          id: triggerProps.id,
          'aria-labelledby': triggerProps['aria-labelledby']
        });

  return (
    <Field {...fieldProps}>
      <VisuallyHidden aria-hidden='true'>
        <input
          ref={inputRef}
          name={name}
          disabled={disabled}
          value={onChange ? state.selectedItem?.textValue || '' : undefined}
          onChange={onChange}
          tabIndex={-1}
        />
      </VisuallyHidden>
      <SelectTrigger
        {...mergeProps(elementProps, selectTriggerProps)}
        as={asSelectTrigger}
        ref={buttonRef}
        size={size}
        hasError={error}
        valueProps={valueProps}
        placeholder={placeholder}
      >
        {state.selectedItem && renderValue(state.selectedItem)}
      </SelectTrigger>
      {type === 'modal' && (
        <SelectModal
          isOpen={state.isOpen}
          state={state}
          onClose={state.close}
          selectedAccount={state.selectedItem?.key}
          title={modalTitle}
        />
      )}
    </Field>
  );
};

const _Select = forwardRef(Select) as <T extends SelectObject>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof Select>;

Select.displayName = 'Select';

export { _Select as Select };
export type { SelectProps };
