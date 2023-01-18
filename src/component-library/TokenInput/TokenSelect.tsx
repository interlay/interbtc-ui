import { useButton } from '@react-aria/button';
import { chain, mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { ChangeEventHandler, InputHTMLAttributes, useRef, useState } from 'react';

import { CoinIcon } from '../CoinIcon';
import { TokenStack } from '../TokenStack';
import { assignFormRef, triggerChangeEvent } from '../utils/input';
import { StyledChevronDown, StyledTicker, StyledTokenSelect } from './TokenInput.style';
import { TokenData } from './TokenList';
import { TokenListModal } from './TokenListModal';

const Icon = ({ value, icons }: Pick<TokenSelectProps, 'value' | 'icons'>) => {
  if (!value) return null;

  if (icons?.length) {
    return <TokenStack offset={icons.length > 2 ? '1/2' : '1/3'} tickers={icons} />;
  }

  return <CoinIcon ticker={value} />;
};

type SelectProps = InputHTMLAttributes<HTMLInputElement> & { ref?: any };

type TokenSelectProps = {
  value?: string;
  icons?: string[];
  isDisabled: boolean;
  tokens: TokenData[];
  onChange: (ticker: string) => void;
  selectProps?: SelectProps;
};

const TokenSelect = ({ value, icons, tokens, isDisabled, onChange, selectProps }: TokenSelectProps): JSX.Element => {
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
        justifyContent='space-evenly'
        gap='spacing1'
        $isClickable={!isDisabled}
      >
        <Icon value={value} icons={icons} />
        <StyledTicker>{value || 'Select Token'}</StyledTicker>
        {!isDisabled && (
          <>
            <StyledChevronDown size='s' />
            <VisuallyHidden>
              <input
                ref={assignFormRef(selectRef, inputRef)}
                {...mergeProps(inputProps, { onChange: handleChange })}
                tabIndex={-1}
                value={value}
              />
            </VisuallyHidden>
          </>
        )}
      </StyledTokenSelect>
      {!isDisabled && (
        <TokenListModal
          isOpen={isOpen}
          tokens={tokens}
          selectedTicker={value}
          onClose={handleClose}
          onSelectionChange={chain(onChange, handleSelectionChange, handleClose)}
        />
      )}
    </>
  );
};

export { TokenSelect };
export type { TokenSelectProps };
