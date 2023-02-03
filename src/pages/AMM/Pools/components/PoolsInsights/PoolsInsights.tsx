import { LiquidityPool } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';

import { formatUSD } from '@/common/utils/utils';
import { Card, Dl, DlGroup } from '@/component-library';
import { calculateAccountLiquidityUSD, calculateTotalLiquidityUSD } from '@/pages/AMM/shared/utils';
import { AccountLiquidityPool } from '@/utils/hooks/api/amm/use-get-account-pools';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { StyledDd, StyledDt } from './PoolsInsights.style';

type PoolsInsightsProps = {
  pools: LiquidityPool[];
  accountPools?: AccountLiquidityPool[];
};

const PoolsInsights = ({ pools, accountPools }: PoolsInsightsProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const supplyAmountUSD = accountPools?.reduce((acc, curr) => {
    const totalLiquidityUSD = calculateTotalLiquidityUSD(curr.data.pooledCurrencies, prices);

    const accountLiquidityUSD = curr.amount
      ? calculateAccountLiquidityUSD(curr.amount, totalLiquidityUSD, curr.data.totalSupply)
      : 0;

    return acc.add(accountLiquidityUSD);
  }, new Big(0));

  const supplyBalanceLabel = supplyAmountUSD ? formatUSD(supplyAmountUSD.toNumber() || 0, { compact: true }) : '-';

  const totalLiquidity = pools.reduce((acc, pool) => {
    const poolLiquidityUSD = calculateTotalLiquidityUSD(pool.pooledCurrencies, prices);

    return acc.add(poolLiquidityUSD);
  }, new Big(0));

  const totalLiquidityUSD = formatUSD(totalLiquidity?.toNumber() || 0, { compact: true });

  return (
    <Dl wrap direction='row'>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>{t('supply_balance')}</StyledDt>
          <StyledDd color='secondary'>{supplyBalanceLabel}</StyledDd>
        </DlGroup>
      </Card>
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>{t('total_liquidity')}</StyledDt>
          <StyledDd color='secondary'>{totalLiquidityUSD}</StyledDd>
        </DlGroup>
      </Card>
      <Card direction='row' flex='1' gap='spacing2' alignItems='center' justifyContent='space-between'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>{t('rewards')}</StyledDt>
          <StyledDd color='secondary'>-</StyledDd>
        </DlGroup>
      </Card>
    </Dl>
  );
};

export { PoolsInsights };
export type { PoolsInsightsProps };
