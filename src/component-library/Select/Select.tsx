import * as React from 'react';
import { useSelectState } from 'react-stately';
import { useSelect, useButton, mergeProps, useFocusRing, VisuallyHidden } from 'react-aria';
import { ListBox } from './ListBox';
import { Popover } from './Popover';
import { Button, Label, StyledIcon, Value, Wrapper, TextField } from './Select.style';
import type { CollectionBase } from '@react-types/shared';

interface Props<T = any> extends CollectionBase<T> {
  label?: string;
  description?: string;
  open?: boolean;
  loading?: boolean;
}

const defaultProps = {};

type NativeAttrs = Omit<React.InputHTMLAttributes<Element>, keyof Props>;

type SelectProps = Props & NativeAttrs & Partial<typeof defaultProps>;

const Select = React.forwardRef<HTMLInputElement, SelectProps>(
  (props: SelectProps, selfInputRef): JSX.Element => {
    const { name, disabled, loading, open, required, onChange, ...rest } = props;

    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(selfInputRef, () => inputRef.current as any);

    const handleSelectionChange = (key: React.Key) => {
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

    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const { labelProps, triggerProps, valueProps, menuProps, descriptionProps } = useSelect(
      ariaProps,
      state,
      buttonRef
    );

    const { buttonProps } = useButton(triggerProps, buttonRef);

    const { focusProps, isFocusVisible } = useFocusRing();
    return (
      <TextField>
        <Label {...labelProps}>{props.label}</Label>
        <Wrapper>
          <VisuallyHidden>
            <input
              ref={inputRef}
              name={name}
              disabled={disabled}
              value={state.selectedItem?.textValue || ''}
              onChange={onChange}
              onFocus={() => buttonRef.current?.focus()}
            />
          </VisuallyHidden>
          <Button
            {...mergeProps(buttonProps, focusProps)}
            ref={buttonRef}
            isOpen={open}
            isFocusVisible={isFocusVisible}
          >
            <Value {...valueProps}>{state.selectedItem ? state.selectedItem.rendered : 'Select an option'}</Value>
            <StyledIcon />
          </Button>
          {state.isOpen && (
            <Popover isOpen={state.isOpen} onClose={state.close}>
              <ListBox {...menuProps} state={state} />
            </Popover>
          )}
        </Wrapper>
        <p {...descriptionProps}>{props.description}</p>
      </TextField>
    );
  }
);

Select.displayName = 'Select';

export { Select };
export type { SelectProps };
