import { CoinIcon } from '../CoinIcon';
import { Flex } from '../Flex';
import { useSelectModalContext } from '../Select/SelectModalContext';
import { Span } from '../Text';
import { StyledListItemLabel, StyledListTokenWrapper } from './TokenInput.style';
import { TokenData } from './TokenSelect';

type TokenListItemProps = { isDisabled?: boolean } & TokenData;

const TokenListItem = ({ balance, balanceUSD, value, tickers, isDisabled }: TokenListItemProps): JSX.Element => {
  const isSelected = useSelectModalContext().selectedItem?.key === value && !isDisabled;

  return (
    <>
      <StyledListTokenWrapper alignItems='center' gap='spacing2' flex='1'>
        <CoinIcon size={tickers ? 'lg' : 'md'} ticker={value} tickers={tickers} />
        <StyledListItemLabel $isSelected={isSelected}>{value}</StyledListItemLabel>
      </StyledListTokenWrapper>
      <Flex direction='column' alignItems='flex-end' gap='spacing2' flex='0'>
        <StyledListItemLabel $isSelected={isSelected}>{balance}</StyledListItemLabel>
        <Span size='s' color='tertiary'>
          {balanceUSD}
        </Span>
      </Flex>
    </>
  );
};

export { TokenListItem };
export type { TokenListItemProps };
