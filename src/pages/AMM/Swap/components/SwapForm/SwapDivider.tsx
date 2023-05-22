import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { PressEvent } from '@react-types/shared';
import { useRef } from 'react';

import { ArrowsUpDown } from '@/assets/icons';

import { StyledBackground, StyledCircle, StyledDivider, StyledWrapper } from './SwapForm.style';

type SwapDividerProps = {
  onPress: (e: PressEvent) => void;
};

const SwapDivider = ({ onPress }: SwapDividerProps): JSX.Element | null => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton({ onPress, 'aria-label': 'switch tokens' }, ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <StyledWrapper>
      <StyledDivider orientation='horizontal' color='tertiary' />
      <StyledBackground />
      <StyledCircle ref={ref} $isFocusVisible={isFocusVisible} {...mergeProps(buttonProps, focusProps)}>
        <ArrowsUpDown color='secondary' strokeWidth={2} size='s' />
      </StyledCircle>
    </StyledWrapper>
  );
};

export { SwapDivider };
