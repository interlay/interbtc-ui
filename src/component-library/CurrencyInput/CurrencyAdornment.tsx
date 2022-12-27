import { useButton } from '@react-aria/button';
import { PressEvent } from '@react-types/shared';
import { useRef } from 'react';

import { Tokens } from '../types';
import { StyledChevronDown, StyledCoinIcon, StyledCurrencyAdornment, StyledTicker } from './CurrencyInput.style';

type CurrencyAdornmentProps = {
  currency: string;
  onPress?: (e: PressEvent) => void;
};

const CurrencyAdornment = ({ currency, onPress }: CurrencyAdornmentProps): JSX.Element => {
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
    <StyledCurrencyAdornment
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
    </StyledCurrencyAdornment>
  );
};

export { CurrencyAdornment };
export type { CurrencyAdornmentProps };
