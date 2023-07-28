import { convertMonetaryAmountToValueInUSD, formatPercentage } from '@/common/utils/utils';
import { Card, Dd, Dl, DlGroup, Dt } from '@/component-library';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { getTokenPrice } from '@/utils/helpers/prices';

import { StrategyData } from '../../hooks/use-get-strategies';
import { StrategyPositionData } from '../../hooks/use-get-strategy-position';

type Props = {
  position: StrategyPositionData;
  stratetgy: StrategyData;
};

const StrategyInsights = ({ position, stratetgy }: Props): JSX.Element => {
  const { amount, earnedAmount } = position;

  const prices = useGetPrices();
  const price = getTokenPrice(prices, amount.currency.ticker);

  return (
    <Dl wrap direction='row'>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing2'>
          <Dt weight='bold' color='primary'>
            My deposit
          </Dt>
          <Dd weight='bold' color='secondary'>
            {amount.toHuman()} {amount.currency.ticker} ({convertMonetaryAmountToValueInUSD(amount, price?.usd)})
          </Dd>
        </DlGroup>
      </Card>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing2'>
          <Dt weight='bold' color='primary'>
            APY
          </Dt>
          <Dd weight='bold' color='secondary'>
            {formatPercentage(stratetgy.interest.toNumber())}
          </Dd>
        </DlGroup>
      </Card>
      <Card direction='row' flex={'1'} gap='spacing2' alignItems='center' justifyContent='space-between'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing2'>
          <Dt weight='bold' color='primary'>
            My earnings
          </Dt>
          <Dd weight='bold' color='secondary'>
            {earnedAmount.toHuman()} {earnedAmount.currency.ticker} (
            {convertMonetaryAmountToValueInUSD(earnedAmount, price?.usd)})
          </Dd>
        </DlGroup>
      </Card>
    </Dl>
  );
};

export { StrategyInsights };
