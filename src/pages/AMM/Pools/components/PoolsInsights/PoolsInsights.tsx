import { LiquidityPool } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';

import { formatUSD } from '@/common/utils/utils';
import { Card, Dl, DlGroup } from '@/component-library';
import { getTokenPrice } from '@/utils/helpers/prices';
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
    const totalLiquidityUSD = curr.data.pooledCurrencies.reduce(
      (total, currentAmount) => total + (getTokenPrice(prices, currentAmount.currency.ticker)?.usd || 0),
      0
    );

    const accountLiquidityUSD =
      curr.amount?.mul(totalLiquidityUSD).div(curr.data.totalSupply.toBig()).toBig().toNumber() || 0;

    return acc.add(accountLiquidityUSD);
  }, new Big(0));

  const supplyBalanceLabel = supplyAmountUSD ? formatUSD(supplyAmountUSD.toNumber() || 0) : '-';

  const totalLiquidity = pools.reduce((acc, pool) => {
    const poolLiquidityUSD = pool.pooledCurrencies.reduce(
      (total, currentAmount) => total + (getTokenPrice(prices, currentAmount.currency.ticker)?.usd || 0),
      0
    );

    return acc.add(poolLiquidityUSD);
  }, new Big(0));

  const totalLiquidityUSD = formatUSD(totalLiquidity?.toNumber() || 0);

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
