import { useFocusRing } from '@react-aria/focus';
import { usePress } from '@react-aria/interactions';
import { AriaSwitchProps, useSwitch } from '@react-aria/switch';
import { mergeProps } from '@react-aria/utils';
import { useToggleState } from '@react-stately/toggle';
import { PressEvent } from '@react-types/shared';
import { ChangeEvent, forwardRef, HTMLAttributes, useRef } from 'react';

import { TextProps } from '../Text';
import { useDOMRef } from '../utils/dom';
import { Placement } from '../utils/prop-types';
import { StyledInput, StyledLabel, StyledSwitch, StyledWrapper } from './Switch.style';

type Props = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onPress?: (e: PressEvent) => void;
  labelProps?: TextProps;
  labelPlacement?: Placement;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<AriaSwitchProps, keyof Props>;

type SwitchProps = Props & NativeAttrs & InheritAttrs;

// TODO: add size
const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  ({ children, onChange, className, style, hidden, labelProps, labelPlacement, ...props }, ref): JSX.Element => {
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
      <StyledWrapper
        ref={labelRef}
        className={className}
        style={style}
        hidden={hidden}
        $reverse={labelPlacement === 'left'}
      >
        <StyledInput {...mergeProps(inputProps, focusProps, pressProps, { onChange })} ref={inputRef} />
        <StyledSwitch $isChecked={inputProps.checked} $isFocusVisible={isFocusVisible} />
        {children && <StyledLabel {...labelProps}>{children}</StyledLabel>}
      </StyledWrapper>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };
