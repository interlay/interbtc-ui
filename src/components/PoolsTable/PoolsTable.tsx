import { LiquidityPool, LpCurrency } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatPercentage, formatUSD } from '@/common/utils/utils';
import { getCoinIconProps } from '@/utils/helpers/coin-icon';
import { calculateAccountLiquidityUSD, calculateTotalLiquidityUSD } from '@/utils/helpers/pool';
import { getFarmingApr } from '@/utils/helpers/pools';
import { DateRangeVolume, useGetDexVolumes } from '@/utils/hooks/api/use-get-dex-volume';
import { useGetPoolsTradingApr } from '@/utils/hooks/api/use-get-pools-trading-apr';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { AssetCell, BalanceCell, Cell, Table, TableProps } from '../DataGrid';

enum PoolsTableColumns {
  POOL_NAME = 'poolName',
  APR = 'apr',
  TOTAL_LIQUIDITY = 'totalLiquidity',
  SEVEN_DAY_VOLUME = 'sevenDayVolume',
  ACCOUNT_LIQUIDITY = 'accountLiquidity'
}

type PoolsTableRow = {
  id: string;
  [PoolsTableColumns.POOL_NAME]: ReactNode;
  [PoolsTableColumns.APR]: ReactNode;
  [PoolsTableColumns.TOTAL_LIQUIDITY]: ReactNode;
  [PoolsTableColumns.SEVEN_DAY_VOLUME]: ReactNode;
  [PoolsTableColumns.ACCOUNT_LIQUIDITY]?: ReactNode;
};

type PoolsTableProps = {
  variant: 'available-pools' | 'account-pools';
  pools: Array<{ data: LiquidityPool; amount?: MonetaryAmount<LpCurrency> }>;
  onRowAction?: TableProps['onRowAction'];
  title?: ReactNode;
};

const PoolsTable = ({ variant, pools, onRowAction, title }: PoolsTableProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const titleId = useId();
  const { getDexTotalVolumeUSD } = useGetDexVolumes(DateRangeVolume.D7);
  const { getTradingAprOfPool } = useGetPoolsTradingApr();

  const isAccountPools = variant === 'account-pools';

  const commonColumns = [
    { name: t('amm.pools.pool_name'), uid: PoolsTableColumns.POOL_NAME },
    { name: t('apr'), uid: PoolsTableColumns.APR },
    { name: t('total_liquidity'), uid: PoolsTableColumns.TOTAL_LIQUIDITY },
    { name: t('7_day_volume'), uid: PoolsTableColumns.SEVEN_DAY_VOLUME }
  ];

  const borrowAssetsColumns = isAccountPools
    ? [...commonColumns, { name: t('my_liquidity'), uid: PoolsTableColumns.ACCOUNT_LIQUIDITY }]
    : commonColumns;

  const rows: PoolsTableRow[] = useMemo(
    () =>
      pools.map(({ data, amount: accountLPTokenAmount }) => {
        const { pooledCurrencies, lpToken, rewardAmountsYearly, totalSupply, isEmpty } = data;
        const poolName = (
          <AssetCell
            aria-label={lpToken.ticker}
            tag={isEmpty ? 'illiquid' : undefined}
            {...getCoinIconProps(lpToken)}
          />
        );

        const totalLiquidityUSD = calculateTotalLiquidityUSD(pooledCurrencies, prices);

        const farmingApr = getFarmingApr(rewardAmountsYearly, totalSupply, totalLiquidityUSD, prices);
        const tradingApr = getTradingAprOfPool(data);
        const aprAmount = farmingApr.add(tradingApr);
        const apr = <Cell label={isEmpty ? 'N/A' : formatPercentage(aprAmount.toNumber())} />;

        // TODO: revert alignItems prop when `sevenDayVolume` is adressed
        const totalLiquidity = <Cell label={formatUSD(totalLiquidityUSD, { compact: true })} alignItems='flex-start' />;

        const total7DayVolumeUSD = getDexTotalVolumeUSD(pooledCurrencies.map((pooled) => pooled.currency.ticker));
        const total7DayVolumeLabel = formatUSD(total7DayVolumeUSD, { compact: true });
        const sevenDayVolume = (
          <Cell label={total7DayVolumeLabel} alignItems={isAccountPools ? 'flex-start' : 'flex-end'} />
        );

        const accountLiquidityUSD =
          accountLPTokenAmount && !isEmpty
            ? calculateAccountLiquidityUSD(accountLPTokenAmount, totalLiquidityUSD, totalSupply)
            : 0;

        const accountLiquidity =
          variant === 'account-pools' && !!accountLPTokenAmount ? (
            <BalanceCell amount={accountLPTokenAmount} amountUSD={accountLiquidityUSD} alignItems='flex-end' />
          ) : undefined;

        return {
          id: lpToken.ticker,
          poolName,
          apr,
          totalLiquidity,
          sevenDayVolume,
          accountLiquidity
        };
      }),
    [getDexTotalVolumeUSD, isAccountPools, pools, prices, variant, getTradingAprOfPool]
  );

  return (
    <Table
      title={title || (isAccountPools ? t('amm.pools.my_pools') : t('amm.pools.other_pools'))}
      titleId={titleId}
      onRowAction={onRowAction}
      rows={rows}
      columns={borrowAssetsColumns}
    />
  );
};

export { PoolsTable };
export type { PoolsTableProps };
