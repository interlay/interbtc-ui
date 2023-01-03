import { useButton } from '@react-aria/button';
import { chain, mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { ChangeEventHandler, InputHTMLAttributes, useRef, useState } from 'react';

import { assignFormRef, triggerChangeEvent } from '../utils/input';
import { StyledChevronDown, StyledCoinIcon, StyledTicker, StyledTokenSelect } from './TokenInput.style';
import { TokenData } from './TokenList';
import { TokenListModal } from './TokenListModal';

type SelectProps = InputHTMLAttributes<HTMLInputElement> & { ref?: any };

type TokenSelectProps = {
  token?: string;
  isDisabled: boolean;
  tokens: TokenData[];
  onChange: (ticker: string) => void;
  selectProps?: SelectProps;
};

const TokenSelect = ({ token, tokens, isDisabled, onChange, selectProps }: TokenSelectProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false);

  const tokenButtonRef = useRef<HTMLDivElement>(null);

  const { ref: selectRef, ...inputProps } = selectProps || {};
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { buttonProps } = useButton(
    {
      onPress: () => setOpen(true),
      elementType: 'div',
      isDisabled
    },
    tokenButtonRef
  );

  const handleClose = () => setOpen(false);

  const handleSelectionChange = (ticker: string) => triggerChangeEvent(inputRef, ticker);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => onChange(e.target.value);

  return (
    <>
      <StyledTokenSelect
        {...(!isDisabled && buttonProps)}
        ref={tokenButtonRef}
        alignItems='center'
        justifyContent='center'
        gap='spacing1'
        $isClickable={!isDisabled}
        $hasToken={!!token}
      >
        {token && <StyledCoinIcon ticker={token} />}
        <StyledTicker>{token || 'Select Token'}</StyledTicker>
        {!isDisabled && (
          <>
            <StyledChevronDown />
            <VisuallyHidden>
              <input
                ref={assignFormRef(selectRef, inputRef)}
                tabIndex={-1}
                value={token}
                {...mergeProps(inputProps, { onChange: handleChange })}
              />
            </VisuallyHidden>
          </>
        )}
      </StyledTokenSelect>
      {!isDisabled && (
        <TokenListModal
          isOpen={isOpen}
          tokens={tokens}
          selectedToken={token}
          onClose={handleClose}
          onSelectionChange={chain(onChange, handleSelectionChange, handleClose)}
        />
      )}
    </>
  );
};

export { TokenSelect };
export type { TokenSelectProps };
