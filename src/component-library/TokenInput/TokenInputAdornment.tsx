import { useButton } from '@react-aria/button';
import { PressEvent } from '@react-types/shared';
import { useRef } from 'react';

import { Tokens } from '../types';
import { StyledChevronDown, StyledCoinIcon, StyledTicker, StyledTokenInputAdornment } from './TokenInput.style';

type TokenInputAdornmentProps = {
  token?: string;
  onPress?: (e: PressEvent) => void;
};

const TokenInputAdornment = ({ token, onPress }: TokenInputAdornmentProps): JSX.Element => {
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
    <StyledTokenInputAdornment
      {...(onPress && buttonProps)}
      ref={tokenButtonRef}
      alignItems='center'
      justifyContent='center'
      gap='spacing1'
      $isClickable={isTokenClickable}
      $hasToken={!!token}
    >
      {token && <StyledCoinIcon size='inherit' coin={token as Tokens} />}
      <StyledTicker>{token || 'Select Token'}</StyledTicker>
      {isTokenClickable && <StyledChevronDown />}
    </StyledTokenInputAdornment>
  );
};

export { TokenInputAdornment };
export type { TokenInputAdornmentProps };
