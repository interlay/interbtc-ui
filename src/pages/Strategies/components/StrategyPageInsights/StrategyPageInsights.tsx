import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat, formatPercentage } from '@/common/utils/utils';
import { Card, Dl, DlGroup } from '@/component-library';
import { StyledDd, StyledDt } from '@/component-library/Text/Dl/Dl.style';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { STRATEGIES, StrategyType } from '@/types/strategies';
import { getTokenPrice } from '@/utils/helpers/prices';

import { useGetStrategyInsights } from '../../hooks/use-get-strategy-insights';

type Props = {
  strategyType: StrategyType;
};

const StrategyPageInsights = ({ strategyType }: Props): JSX.Element => {
  const prices = useGetPrices();
  const { depositedAmount, interest, earnedAmount } = useGetStrategyInsights(strategyType);

  const currency = STRATEGIES[strategyType].currency;
  const price = getTokenPrice(prices, currency.ticker);
  return (
    <Dl wrap direction='row'>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>My deposit</StyledDt>
          <StyledDd color='secondary'>
            {displayMonetaryAmount(depositedAmount)} {currency.ticker} (
            {displayMonetaryAmountInUSDFormat(depositedAmount, price?.usd)})
          </StyledDd>
        </DlGroup>
      </Card>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>APY</StyledDt>
          <StyledDd color='secondary'>{formatPercentage(interest)}</StyledDd>
        </DlGroup>
      </Card>
      <Card direction='row' flex={'1'} gap='spacing2' alignItems='center' justifyContent='space-between'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>My earnings</StyledDt>
          <StyledDd color='secondary'>
            {displayMonetaryAmount(earnedAmount)} {currency.ticker} (
            {displayMonetaryAmountInUSDFormat(earnedAmount, price?.usd)})
          </StyledDd>
        </DlGroup>
      </Card>
    </Dl>
  );
};

export { StrategyPageInsights };
