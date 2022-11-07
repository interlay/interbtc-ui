import { useFocusRing } from '@react-aria/focus';
import { AriaSwitchProps, useSwitch } from '@react-aria/switch';
import { mergeProps } from '@react-aria/utils';
import { useToggleState } from '@react-stately/toggle';
import { forwardRef, HTMLAttributes, useRef } from 'react';

import { useDOMRef } from '../utils/dom';
import { StyledInput, StyledLabel, StyledSwitch, StyledWrapper } from './Switch.style';

type Props = { onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void };

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<AriaSwitchProps, keyof Props>;

type SwitchProps = Props & NativeAttrs & InheritAttrs;

const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  ({ children, onChange, className, style, hidden, ...props }, ref): JSX.Element => {
    const labelRef = useDOMRef(ref);
    const inputRef = useRef<HTMLInputElement>(null);

    const state = useToggleState(props);
    const { inputProps } = useSwitch(props, state, inputRef);

    const { focusProps, isFocusVisible } = useFocusRing({
      autoFocus: inputProps.autoFocus
    });

    return (
      <StyledWrapper ref={labelRef} className={className} style={style} hidden={hidden}>
        <StyledInput {...mergeProps(inputProps, focusProps, { onChange })} ref={inputRef} />
        <StyledSwitch $isChecked={inputProps.checked} $isFocusVisible={isFocusVisible} />
        {children && <StyledLabel>{children}</StyledLabel>}
      </StyledWrapper>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };
