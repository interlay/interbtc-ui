import { CoinIcon } from '../CoinIcon';
import { Flex } from '../Flex';
import { ListItem, ListProps } from '../List';
import { Span } from '../Text';
import { TokenStack } from '../TokenStack';
import { TokenTicker } from './TokenInput';
import { StyledList, StyledListItemLabel, StyledListTokenWrapper } from './TokenInput.style';

type TokenData = {
  ticker: TokenTicker;
  balance: number;
  balanceUSD: string;
};

type Props = {
  items: TokenData[];
  selectedTicker?: string;
  onSelectionChange?: (ticker: string) => void;
};

type InheritAttrs = Omit<ListProps, keyof Props | 'children'>;

type TokenListProps = Props & InheritAttrs;

const TokenList = ({ items, selectedTicker, onSelectionChange, ...props }: TokenListProps): JSX.Element => {
  const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
    const [selectedKey] = [...key];

    if (!selectedKey) return;

    onSelectionChange?.(selectedKey as string);
  };

  return (
    <StyledList
      aria-label='select token'
      variant='secondary'
      selectionMode='single'
      onSelectionChange={handleSelectionChange}
      selectedKeys={selectedTicker ? [selectedTicker] : undefined}
      {...props}
    >
      {items.map((item) => {
        const tickerText = typeof item.ticker === 'string' ? item.ticker : item.ticker.text;

        const isSelected = selectedTicker === tickerText;

        return (
          <ListItem
            key={tickerText}
            textValue={tickerText}
            alignItems='center'
            justifyContent='space-between'
            gap='spacing4'
          >
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
          </ListItem>
        );
      })}
    </StyledList>
  );
};

export { TokenList };
export type { TokenData, TokenListProps };
