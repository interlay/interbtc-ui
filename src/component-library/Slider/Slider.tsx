import { useFocusRing } from '@react-aria/focus';
import { usePress } from '@react-aria/interactions';
import { AriaSwitchProps, useSwitch } from '@react-aria/switch';
import { mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useToggleState } from '@react-stately/';
import { ChangeEvent, forwardRef, HTMLAttributes, useRef } from 'react';

import { useDOMRef } from '../utils/dom';
import { StyledInput, StyledLabel, StyledSwitch, StyledWrapper } from './Slider.style';

type Props = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<AriaSwitchProps, keyof Props>;

type SwitchProps = Props & NativeAttrs & InheritAttrs;

const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  ({ children, onChange, className, style, hidden, ...props }, ref): JSX.Element => {
    const labelRef = useDOMRef(ref);
    const inputRef = useRef<HTMLInputElement>(null);

    const ariaProps: AriaSwitchProps = { children, ...props };

    const state = useToggleState(ariaProps);
    const { inputProps } = useSwitch(ariaProps, state, inputRef);

    const { focusProps, isFocusVisible } = useFocusRing({
      autoFocus: inputProps.autoFocus
    });

    const { pressProps } = usePress(props);

    return (
      <StyledWrapper ref={labelRef} className={className} style={style} hidden={hidden}>
        <VisuallyHidden>
          <StyledInput {...mergeProps(inputProps, focusProps, pressProps, { onChange })} ref={inputRef} />
        </VisuallyHidden>
        <StyledSwitch $isChecked={inputProps.checked} $isFocusVisible={isFocusVisible} />
        {children && <StyledLabel {...labelProps}>{children}</StyledLabel>}
      </StyledWrapper>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };
