import { convertMonetaryAmountToValueInUSD, formatPercentage } from '@/common/utils/utils';
import { Card, CoinIcon, Dd, DlGroup, Dt, Flex } from '@/component-library';
import { formatUSD } from '@/component-library/utils/format';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { getTokenPrice } from '@/utils/helpers/prices';

import { StrategyData } from '../../hooks/use-get-strategies';
import { StrategyPositionData } from '../../hooks/use-get-strategy-position';
import { StyledDl } from './StrategyInsights.styles';

type Props = {
  stratetgy: StrategyData;
  position?: StrategyPositionData;
};

const StrategyInsights = ({ stratetgy, position }: Props): JSX.Element => {
  const { amount, earnedAmount } = position || {};

  const prices = useGetPrices();
  const price = getTokenPrice(prices, stratetgy.currencies.primary.ticker);

  const amountUSD = (amount && convertMonetaryAmountToValueInUSD(amount, price?.usd)) || 0;
  const amountUSDLabel = formatUSD(amountUSD, { compact: true });

  const earnedUSD = (earnedAmount && convertMonetaryAmountToValueInUSD(earnedAmount, price?.usd)) || 0;
  const earnedUSDLabel = formatUSD(earnedUSD, { compact: true });

  return (
    <StyledDl wrap direction='row' gap='spacing4'>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing2'>
          <Dt size='s' weight='bold' color='primary'>
            My Deposit
          </Dt>
          <Dd size='xs' weight='bold' color='secondary'>
            <Flex gap='spacing2' alignItems='center'>
              <CoinIcon ticker={stratetgy.currencies.primary.ticker} />
              {amount?.toHuman() || 0} {stratetgy.currencies.primary.ticker} ({amountUSDLabel})
            </Flex>
          </Dd>
        </DlGroup>
      </Card>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing2'>
          <Dt size='s' weight='bold' color='primary'>
            APY
          </Dt>
          <Dd size='xs' weight='bold' color='secondary'>
            {formatPercentage(stratetgy.interestRate.toNumber())}
          </Dd>
        </DlGroup>
      </Card>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing2'>
          <Dt size='s' weight='bold' color='primary'>
            My earnings
          </Dt>
          <Dd size='xs' weight='bold' color='secondary'>
            {earnedAmount?.toHuman() || 0} {stratetgy.currencies.primary.ticker} ({earnedUSDLabel})
          </Dd>
        </DlGroup>
      </Card>
    </StyledDl>
  );
};

export { StrategyInsights };
