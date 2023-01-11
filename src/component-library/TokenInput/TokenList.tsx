import { CoinIcon } from '../CoinIcon';
import { Flex } from '../Flex';
import { ListItem, ListProps } from '../List';
import { Span } from '../Text';
import { StyledList, StyledListItemLabel } from './TokenInput.style';

type TokenData = {
  ticker: string;
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
      selectionMode='single'
      onSelectionChange={handleSelectionChange}
      selectedKeys={selectedTicker ? [selectedTicker] : undefined}
      {...props}
    >
      {items.map((item) => {
        const isSelected = selectedTicker === item.ticker;

        return (
          <ListItem
            aria-label='select token'
            key={item.ticker}
            textValue={item.ticker}
            alignItems='center'
            justifyContent='space-between'
            gap='spacing4'
          >
            <Flex alignItems='center' gap='spacing2'>
              <CoinIcon ticker={item.ticker} />
              <StyledListItemLabel $isSelected={isSelected}>{item.ticker}</StyledListItemLabel>
            </Flex>
            <Flex direction='column' alignItems='center' gap='spacing2'>
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
