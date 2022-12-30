import { Coin } from '../Coin';
import { Flex } from '../Flex';
import { ListItem, ListProps } from '../List';
import { Span } from '../Text';
import { StyledList, StyledListItemLabel } from './CurrencyInput.style';

type CurrencyData = {
  ticker: string;
  balance: number;
  blanceUSD: string;
};

type Props = {
  items: CurrencyData[];
  selectedCurrency: string;
  onSelect?: (ticker: string) => void;
};

type InheritAttrs = Omit<ListProps, keyof Props | 'children'>;

type CurrencyListProps = Props & InheritAttrs;

const CurrencyList = ({ items, selectedCurrency, onSelect, ...props }: CurrencyListProps): JSX.Element => {
  const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
    const [selectedKey] = [...key];
    onSelect?.(selectedKey as string);
  };

  return (
    <StyledList
      selectionMode='single'
      onSelectionChange={handleSelectionChange}
      selectedKeys={[selectedCurrency]}
      {...props}
    >
      {items.map((currency) => {
        const isSelected = selectedCurrency === currency.ticker;

        return (
          <ListItem
            key={currency.ticker}
            textValue={currency.ticker}
            alignItems='center'
            justifyContent='space-between'
            gap='spacing4'
          >
            <Flex alignItems='center' gap='spacing2'>
              <Coin ticker={currency.ticker} />
              <StyledListItemLabel $isSelected={isSelected}>{currency.ticker}</StyledListItemLabel>
            </Flex>
            <Flex direction='column' alignItems='center' gap='spacing2'>
              <StyledListItemLabel $isSelected={isSelected}>{currency.balance}</StyledListItemLabel>
              <Span size='s' color='tertiary'>
                {currency.blanceUSD}
              </Span>
            </Flex>
          </ListItem>
        );
      })}
    </StyledList>
  );
};

export { CurrencyList };
export type { CurrencyData, CurrencyListProps };
