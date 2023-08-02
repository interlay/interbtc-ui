import { convertMonetaryAmountToValueInUSD, formatPercentage } from '@/common/utils/utils';
import { Card, Dd, Dl, DlGroup, Dt } from '@/component-library';
import { formatUSD } from '@/component-library/utils/format';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { getTokenPrice } from '@/utils/helpers/prices';

import { StrategyData } from '../../hooks/use-get-strategies';
import { StrategyPositionData } from '../../hooks/use-get-strategy-position';

type Props = {
  stratetgy: StrategyData;
  position?: StrategyPositionData;
};

const StrategyInsights = ({ stratetgy, position }: Props): JSX.Element => {
  const { amount, earnedAmount } = position || {};

  const prices = useGetPrices();
  const price = getTokenPrice(prices, stratetgy.currency.ticker);

  const amountUSD = (amount && convertMonetaryAmountToValueInUSD(amount, price?.usd)) || 0;
  const amountUSDLabel = formatUSD(amountUSD, { compact: true });

  const earnedUSD = (earnedAmount && convertMonetaryAmountToValueInUSD(earnedAmount, price?.usd)) || 0;
  const earnedUSDLabel = formatUSD(earnedUSD, { compact: true });

  return (
    <Dl wrap direction='row'>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing2'>
          <Dt weight='bold' color='primary'>
            My deposit
          </Dt>
          <Dd weight='bold' color='secondary'>
            {amount?.toHuman() || 0} {stratetgy.currency.ticker} ({amountUSDLabel})
          </Dd>
        </DlGroup>
      </Card>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing2'>
          <Dt weight='bold' color='primary'>
            APY
          </Dt>
          <Dd weight='bold' color='secondary'>
            {formatPercentage(stratetgy.interestRate.toNumber())}
          </Dd>
        </DlGroup>
      </Card>
      <Card direction='row' flex={'1'} gap='spacing2' alignItems='center' justifyContent='space-between'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing2'>
          <Dt weight='bold' color='primary'>
            My earnings
          </Dt>
          <Dd weight='bold' color='secondary'>
            {earnedAmount?.toHuman() || 0} {stratetgy.currency.ticker} ({earnedUSDLabel})
          </Dd>
        </DlGroup>
      </Card>
    </Dl>
  );
};

export { StrategyInsights };
