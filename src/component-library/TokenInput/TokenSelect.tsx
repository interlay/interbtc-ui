import { CoinIcon } from '../CoinIcon';
import { Flex } from '../Flex';
import { Item, Select, SelectProps } from '../Select';
import { Span } from '../Text';
import { StyledTicker, StyledTokenSelect } from './TokenInput.style';
import { TokenListItem } from './TokenListItem';

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

type TokenSelectProps = Omit<SelectProps<TokenData, 'modal'>, 'children' | 'type'>;

const TokenSelect = ({ label: labelProp, 'aria-label': ariaLabelProp, ...props }: TokenSelectProps): JSX.Element => {
  // it is unlikely that labelProp is not a string, but we need to avoid any accessibility error
  const labelText = (typeof labelProp === 'string' && labelProp) || ariaLabelProp;
  const ariaLabel = labelText && `Choose token for ${labelText} field`;

  return (
    <Select<TokenData, 'modal'>
      {...props}
      type='modal'
      asSelectTrigger={StyledTokenSelect}
      renderValue={(item) => <Value data={item.value} />}
      placeholder={<Span>Select Token</Span>}
      modalTitle='Select Token'
      aria-label={ariaLabel}
    >
      {(data: TokenData) => (
        <Item key={data.value} textValue={data.value}>
          <TokenListItem {...data} />
        </Item>
      )}
    </Select>
  );
};

export { TokenSelect };
export type { TokenData, TokenSelectProps };
