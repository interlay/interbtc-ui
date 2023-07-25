import { LiquidityPool } from '@interlay/interbtc-api';
import { useTranslation } from 'react-i18next';

import { formatPercentage } from '@/common/utils/utils';
import { Flex } from '@/component-library';
import { ApyDetails, ApyDetailsGroup, ApyDetailsGroupItem, Cell } from '@/components';
import { useGetPoolsTradingApr } from '@/hooks/api/use-get-pools-trading-apr';
import { Prices } from '@/hooks/api/use-get-prices';
import { getFarmingApr } from '@/utils/helpers/pools';

import { StyledTooltip } from './PoolsTable.style';

type PoolApyCellProps = {
  prices?: Prices;
  pool: LiquidityPool;
  totalLiquidityUSD: number;
  onClick?: () => void;
};

const PoolApyCell = ({ pool, prices, totalLiquidityUSD, onClick }: PoolApyCellProps): JSX.Element => {
  const { t } = useTranslation();

  const { getTradingAprOfPool } = useGetPoolsTradingApr();

  const { rewardAmountsYearly, totalSupply, isEmpty } = pool;

  const tradingApr = getTradingAprOfPool(pool);

  const farmingApr = getFarmingApr(rewardAmountsYearly, totalSupply, totalLiquidityUSD, prices);

  const totalApr = farmingApr.add(tradingApr);

  const children = (
    <Cell onClick={onClick} label={isEmpty ? 'N/A' : formatPercentage(totalApr.toNumber())} alignSelf='flex-start' />
  );

  if (!prices) {
    return children;
  }

  const baseAprLabel = formatPercentage(tradingApr);

  const hasRewards = farmingApr.gt(0);

  const label = (
    <ApyDetails>
      <ApyDetailsGroup title={t('apr_breakdown')}>
        <ApyDetailsGroupItem label={t('amm.pools.trading_fee_apr')} value={baseAprLabel} />
        {hasRewards && <ApyDetailsGroupItem label={t('rewards_apr')} value={formatPercentage(farmingApr.toNumber())} />}
      </ApyDetailsGroup>
    </ApyDetails>
  );

  // MEMO: wrapping around a Flex so tooltip is placed correctly
  return (
    <Flex>
      <StyledTooltip label={label}>{children}</StyledTooltip>
    </Flex>
  );
};

export { PoolApyCell };
export type { PoolApyCellProps };
