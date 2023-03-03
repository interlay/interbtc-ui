import { useField } from '@react-aria/label';
import { useSelect } from '@react-aria/select';
import { chain, mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { SelectProps as AriaSelectProps, useSelectState } from '@react-stately/select';
import { CollectionBase, Node } from '@react-types/shared';
import { ForwardedRef, forwardRef, Key, ReactNode, useRef } from 'react';

import { Field, FieldProps, useFieldProps } from '../Field';
import { hasErrorMessage } from '../HelperText/HelperText';
import { useDOMRef } from '../utils/dom';
import { triggerChangeEvent } from '../utils/input';
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
    onSelectionChange: chain((key: Key) => triggerChangeEvent(inputRef, key), onSelectionChange),
    onOpenChange: (isOpen) => {
      return isOpen ? buttonRef.current?.blur() : buttonRef.current?.focus();
    },
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
          disabled,
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
