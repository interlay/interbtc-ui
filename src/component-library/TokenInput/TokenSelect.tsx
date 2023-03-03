import { CoinIcon } from '../CoinIcon';
import { Flex } from '../Flex';
import { Item, Select, SelectProps } from '../Select';
import { useSelectModalContext } from '../Select/SelectModalContext';
import { Span } from '../Text';
import { StyledListItemLabel, StyledListTokenWrapper, StyledTicker, StyledTokenSelect } from './TokenInput.style';

const ListItem = ({ data }: { data: TokenData }) => {
  const isSelected = useSelectModalContext().selectedItem?.key === data.value;

  return (
    <>
      <StyledListTokenWrapper alignItems='center' gap='spacing2' flex='1'>
        <CoinIcon size={data.tickers ? 'lg' : 'md'} ticker={data.value} tickers={data.tickers} />
        <StyledListItemLabel $isSelected={isSelected}>{data.value}</StyledListItemLabel>
      </StyledListTokenWrapper>
      <Flex direction='column' alignItems='flex-end' gap='spacing2' flex='0'>
        <StyledListItemLabel $isSelected={isSelected}>{data.balance}</StyledListItemLabel>
        <Span size='s' color='tertiary'>
          {data.balanceUSD}
        </Span>
      </Flex>
    </>
  );
};

const Value = ({ data }: { data: TokenData }) => (
  <Flex alignItems='center' justifyContent='space-evenly' gap='spacing1'>
    <CoinIcon size={data.tickers ? 'lg' : 'md'} ticker={data.value} tickers={data.tickers} />
    <StyledTicker>{data.value}</StyledTicker>
  </Flex>
);

type TokenData = {
  value: string;
  tickers?: string[];
  balance: string | number;
  balanceUSD: string;
};

type TokenSelectProps = Omit<SelectProps<TokenData>, 'children' | 'type'>;

const TokenSelect = (props: TokenSelectProps): JSX.Element => (
  <Select<TokenData>
    {...props}
    type='modal'
    labelProps={{ isVisuallyHidden: true }}
    asSelectTrigger={StyledTokenSelect}
    renderValue={(item) => <Value data={item.value} />}
    placeholder={<Span>Select Token</Span>}
    modalTitle='Select Token'
  >
    {(data: TokenData) => (
      <Item key={data.value}>
        <ListItem data={data} />
      </Item>
    )}
  </Select>
);

export { TokenSelect };
export type { TokenSelectProps };
