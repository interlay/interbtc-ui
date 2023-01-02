import { Coin } from '../Coin';
import { Flex } from '../Flex';
import { ListItem, ListProps } from '../List';
import { Span } from '../Text';
import { StyledList, StyledListItemLabel } from './TokenInput.style';

type TokenData = {
  ticker: string;
  balance: number;
  blanceUSD: string;
};

type Props = {
  items: TokenData[];
  selectedToken?: string;
  onSelect?: (ticker: string) => void;
};

type InheritAttrs = Omit<ListProps, keyof Props | 'children'>;

type TokenListProps = Props & InheritAttrs;

const TokenList = ({ items, selectedToken, onSelect, ...props }: TokenListProps): JSX.Element => {
  const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
    const [selectedKey] = [...key];
    onSelect?.(selectedKey as string);
  };

  return (
    <StyledList
      selectionMode='single'
      onSelectionChange={handleSelectionChange}
      selectedKeys={selectedToken ? [selectedToken] : undefined}
      {...props}
    >
      {items.map((item) => {
        const isSelected = selectedToken === item.ticker;

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
              <Coin ticker={item.ticker} />
              <StyledListItemLabel $isSelected={isSelected}>{item.ticker}</StyledListItemLabel>
            </Flex>
            <Flex direction='column' alignItems='center' gap='spacing2'>
              <StyledListItemLabel $isSelected={isSelected}>{item.balance}</StyledListItemLabel>
              <Span size='s' color='tertiary'>
                {item.blanceUSD}
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
