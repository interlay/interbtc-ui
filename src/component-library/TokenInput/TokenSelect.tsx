import { useButton } from '@react-aria/button';
import { useField } from '@react-aria/label';
import { chain, mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { InputHTMLAttributes, ReactNode, useRef, useState } from 'react';

import { CoinIcon } from '../CoinIcon';
import { TokenStack } from '../TokenStack';
import { useDOMRef } from '../utils/dom';
import { StyledChevronDown, StyledTicker, StyledTokenSelect } from './TokenInput.style';
import { TokenData } from './TokenList';
import { TokenListModal } from './TokenListModal';

const Icon = ({ value, icons }: Pick<TokenSelectProps, 'value' | 'icons'>) => {
  if (!value) return null;

  if (icons?.length) {
    return <TokenStack offset={icons.length > 2 ? 'lg' : 'md'} tickers={icons} />;
  }

  return <CoinIcon ticker={value} />;
};

type SelectProps = InputHTMLAttributes<HTMLInputElement> & { ref?: any; onSelectionChange?: (ticker: string) => void };

type Props = {
  label?: ReactNode;
  value?: string;
  icons?: string[];
  isDisabled: boolean;
  tokens: TokenData[];
  onChange: (ticker: string) => void;
  selectProps?: SelectProps;
};

type NativeAttrs = Omit<InputHTMLAttributes<unknown>, keyof Props>;

type TokenSelectProps = Props & NativeAttrs;

const TokenSelect = ({
  value,
  icons,
  tokens,
  isDisabled,
  onChange,
  label: labelProp,
  'aria-label': ariaLabel,
  selectProps: selectPropsProp
}: TokenSelectProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false);

  const tokenButtonRef = useRef<HTMLDivElement>(null);

  const { ref, onSelectionChange, ...selectProps } = selectPropsProp || {};
  const inputRef = useDOMRef<HTMLInputElement>(ref);

  const { buttonProps } = useButton(
    {
      onPress: () => setOpen(true),
      elementType: 'div',
      isDisabled
    },
    tokenButtonRef
  );

  const label = labelProp || ariaLabel;

  const { labelProps, fieldProps } = useField({ label });

  const handleClose = () => setOpen(false);

  const isSelect = !isDisabled;

  return (
    <>
      {isSelect && (
        <VisuallyHidden>
          <label {...labelProps}>Choose token for {label} field</label>
          <input
            {...mergeProps(selectProps || {}, fieldProps)}
            ref={inputRef}
            autoComplete='off'
            tabIndex={-1}
            value={value}
          />
        </VisuallyHidden>
      )}
      <StyledTokenSelect
        {...(isSelect && mergeProps(buttonProps, fieldProps))}
        ref={tokenButtonRef}
        alignItems='center'
        justifyContent='space-evenly'
        gap='spacing1'
        $isClickable={isSelect}
      >
        <Icon value={value} icons={icons} />
        <StyledTicker>{value || 'Select Token'}</StyledTicker>
        {isSelect && <StyledChevronDown size='s' />}
      </StyledTokenSelect>
      {isSelect && (
        <TokenListModal
          isOpen={isOpen}
          tokens={tokens}
          selectedTicker={value}
          onClose={handleClose}
          onSelectionChange={chain(onChange, onSelectionChange, handleClose)}
        />
      )}
    </>
  );
};

export { TokenSelect };
export type { TokenSelectProps };
