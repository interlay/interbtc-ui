import { useButton } from '@react-aria/button';
import { PressEvent } from '@react-types/shared';
import { useRef } from 'react';

import { Tokens } from '../types';
import { StyledChevronDown, StyledCoinIcon, StyledTicker, StyledTokenAdornment } from './TokenInput.style';

type TokenAdornmentProps = {
  currency: string;
  onPress?: (e: PressEvent) => void;
};

const TokenAdornment = ({ currency, onPress }: TokenAdornmentProps): JSX.Element => {
  const tokenButtonRef = useRef<HTMLDivElement>(null);

  const isTokenClickable = !!onPress;
  const { buttonProps } = useButton(
    {
      onPress: onPress,
      elementType: 'div',
      isDisabled: !isTokenClickable
    },
    tokenButtonRef
  );

  return (
    <StyledTokenAdornment
      {...(onPress && buttonProps)}
      ref={tokenButtonRef}
      alignItems='center'
      justifyContent='center'
      gap='spacing1'
      $isClickable={isTokenClickable}
    >
      <StyledCoinIcon size='inherit' coin={currency as Tokens} />
      <StyledTicker>{currency}</StyledTicker>
      {isTokenClickable && <StyledChevronDown />}
    </StyledTokenAdornment>
  );
};

export { TokenAdornment };
export type { TokenAdornmentProps };
