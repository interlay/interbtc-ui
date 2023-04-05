import { LiquidityPool, LpCurrency } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatPercentage, formatUSD } from '@/common/utils/utils';
import { calculateAccountLiquidityUSD, calculateTotalLiquidityUSD } from '@/pages/AMM/shared/utils';
import { getCoinIconProps } from '@/utils/helpers/coin-icon';
import { getFarmingApr } from '@/utils/helpers/pools';
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
  // [PoolsTableColumns.SEVEN_DAY_VOLUME]: ReactNode;
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

  const isAccountPools = variant === 'account-pools';

  const commonColumns = [
    { name: t('amm.pools.pool_name'), uid: PoolsTableColumns.POOL_NAME },
    { name: t('apr'), uid: PoolsTableColumns.APR },
    { name: t('total_liquidity'), uid: PoolsTableColumns.TOTAL_LIQUIDITY }
    // { name: t('7_day_volume'), uid: PoolsTableColumns.SEVEN_DAY_VOLUME }
  ];

  const borrowAssetsColumns = isAccountPools
    ? [...commonColumns, { name: t('my_liquidity'), uid: PoolsTableColumns.ACCOUNT_LIQUIDITY }]
    : commonColumns;

  const rows: PoolsTableRow[] = useMemo(
    () =>
      pools.map(({ data, amount: accountLPTokenAmount }) => {
        const { pooledCurrencies, lpToken, rewardAmountsYearly, totalSupply } = data;
        const poolName = <AssetCell aria-label={lpToken.ticker} {...getCoinIconProps(lpToken)} />;

        const totalLiquidityUSD = calculateTotalLiquidityUSD(pooledCurrencies, prices);

        const farmingApr = getFarmingApr(rewardAmountsYearly, totalSupply, totalLiquidityUSD, prices);
        // TODO: add also APR from trading volume based on squid data
        const aprAmount = farmingApr;
        const apr = <Cell label={formatPercentage(aprAmount.toNumber())} />;

        // TODO: revert alignItems prop when `sevenDayVolume` is adressed
        const totalLiquidity = (
          <Cell
            label={formatUSD(totalLiquidityUSD, { compact: true })}
            alignItems={isAccountPools ? 'flex-start' : 'flex-end'}
          />
        );

        // TODO: uncomment and add real value when squid is ready
        // const sevenDayVolume = <MonetaryCell label='-' alignItems={isAccountPools ? 'flex-start' : 'flex-end'} />;

        const accountLiquidityUSD = accountLPTokenAmount
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
          // sevenDayVolume,
          accountLiquidity
        };
      }),
    [isAccountPools, pools, prices, variant]
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
