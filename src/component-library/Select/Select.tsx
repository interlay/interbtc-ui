import { useSelect } from '@react-aria/select';
import { mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { SelectProps as AriaSelectProps, useSelectState } from '@react-stately/select';
import { CollectionBase, Node } from '@react-types/shared';
import { ForwardedRef, forwardRef, Key, ReactNode, useRef } from 'react';

import { Field, FieldProps, useFieldProps } from '../Field';
import { useDOMRef } from '../utils/dom';
import { hasError } from '../utils/input';
import { Sizes } from '../utils/prop-types';
import { SelectModal } from './SelectModal';
import { SelectTrigger } from './SelectTrigger';

type SelectType = 'listbox' | 'modal';

type SelectObject = Record<string, unknown>;

// TODO: listbox to be implemented
type Props<T extends SelectObject, F extends SelectType> = {
  type?: F;
  open?: boolean;
  loading?: boolean;
  size?: Sizes;
  // MEMO: Allows a custom select trigger (TokenInput select)
  asSelectTrigger?: any;
  renderValue?: (item: Node<T>) => ReactNode;
  placeholder?: ReactNode;
  modalTitle?: F extends 'modal' ? ReactNode : never;
};

type InheritAttrs<F extends SelectType, T extends SelectObject = any> = Omit<
  CollectionBase<T> & FieldProps & AriaSelectProps<T>,
  keyof Props<T, F> | 'isDisabled' | 'isLoading' | 'isOpen' | 'isRequired' | 'selectedKey' | 'defaultSelectedKey'
>;

type NativeAttrs<T extends SelectObject, F extends SelectType> = Omit<
  React.InputHTMLAttributes<Element>,
  keyof Props<T, F>
>;

type SelectProps<T extends SelectObject, F extends SelectType> = Props<T, F> & NativeAttrs<T, F> & InheritAttrs<F, T>;

const Select = <T extends SelectObject, F extends SelectType>(
  {
    value,
    defaultValue,
    type = 'listbox' as F,
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
    renderValue = (item) => item.rendered,
    items,
    ...props
  }: SelectProps<T, F>,
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
    items,
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
          value={onChange ? state.selectedKey || '' : undefined}
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
        name={name}
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

const _Select = forwardRef(Select) as <T extends SelectObject, F extends SelectType>(
  props: SelectProps<T, F> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof Select>;

Select.displayName = 'Select';

export { _Select as Select };
export type { SelectProps };
