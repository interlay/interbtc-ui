import { mergeProps } from '@react-aria/utils';
import { InputHTMLAttributes, ReactNode } from 'react';

import { CoinIcon } from '../CoinIcon';
import { Flex } from '../Flex';
import { Item, Select } from '../Select';
import { useSelectModalContext } from '../Select/SelectModalContext';
import { Span } from '../Text';
import { TokenStack } from '../TokenStack';
import {
  StyledListItemLabel,
  StyledListTokenWrapper,
  StyledTicker,
  StyledTokenAdornment,
  StyledTokenSelect
} from './TokenInput.style';
import { TokenData } from './TokenList';

const Icon = ({ value, icons }: Pick<TokenSelectProps, 'value' | 'icons'>) => {
  if (!value) return null;

  if (icons?.length) {
    return <TokenStack offset={icons.length > 2 ? 'lg' : 'md'} tickers={icons} />;
  }

  return <CoinIcon ticker={value} />;
};

const ListItem = ({ item }: { item: TokenData }) => {
  const tickerText = typeof item.ticker === 'string' ? item.ticker : item.ticker.text;

  const isSelected = useSelectModalContext().selectedItem?.key === tickerText;

  return (
    <>
      <StyledListTokenWrapper alignItems='center' gap='spacing2' flex='1'>
        {typeof item.ticker === 'string' ? (
          <CoinIcon ticker={item.ticker} />
        ) : (
          <TokenStack tickers={item.ticker.icons} />
        )}
        <StyledListItemLabel $isSelected={isSelected}>{tickerText}</StyledListItemLabel>
      </StyledListTokenWrapper>
      <Flex direction='column' alignItems='flex-end' gap='spacing2' flex='0'>
        <StyledListItemLabel $isSelected={isSelected}>{item.balance}</StyledListItemLabel>
        <Span size='s' color='tertiary'>
          {item.balanceUSD}
        </Span>
      </Flex>
    </>
  );
};

type SelectProps = InputHTMLAttributes<HTMLInputElement> & { ref?: any };

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
  label,
  selectProps
}: TokenSelectProps): JSX.Element => {
  const isSelect = !isDisabled;

  if (!isSelect) {
    return (
      <StyledTokenAdornment alignItems='center' justifyContent='space-evenly' gap='spacing1'>
        <Icon value={value} icons={icons} />
        <StyledTicker>{value || 'Select Token'}</StyledTicker>
      </StyledTokenAdornment>
    );
  }

  return (
    <Select
      {...mergeProps(selectProps as any)}
      type='modal'
      items={tokens}
      size='medium'
      label={label}
      labelProps={{ isVisuallyHidden: true }}
      onSelectionChange={onChange}
      asSelectTrigger={StyledTokenSelect}
      customRender={(item) => {
        return (
          <Flex alignItems='center' justifyContent='space-evenly' gap='spacing1'>
            <Icon value={item.key as string} icons={icons} />
            <StyledTicker>{item.key as string}</StyledTicker>
          </Flex>
        );
      }}
      placeholder={<Span>Select Token</Span>}
    >
      {(item: TokenData) => {
        const tickerText = typeof item.ticker === 'string' ? item.ticker : item.ticker.text;

        return (
          <Item key={tickerText}>
            <ListItem item={item} />
          </Item>
        );
      }}
    </Select>
  );
};

export { TokenSelect };
export type { TokenSelectProps };
