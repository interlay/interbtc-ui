import { newMonetaryAmount } from '@interlay/interbtc-api';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatPercentage, formatUSD } from '@/common/utils/utils';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { AccountLiquidityPool } from '@/utils/hooks/api/amm/use-get-account-pools';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { PoolName } from '../PoolName';
import { BalanceCell, PoolsBaseTable, PoolsBaseTableProps } from '../PoolsBaseTable';
import { MonetaryCell } from '../PoolsBaseTable/MonetaryCell';

enum BorrowAssetsColumns {
  POOL_NAME = 'poolName',
  APR = 'apr',
  TOTAL_LIQUIDITY = 'totalLiquidity',
  SEVEN_DAY_VOLUME = 'sevenDayVolume',
  ACCOUNT_LIQUIDITY = 'accountLiquidity'
}

type PoolsTableRow = {
  id: string;
  [BorrowAssetsColumns.POOL_NAME]: ReactNode;
  [BorrowAssetsColumns.APR]: ReactNode;
  [BorrowAssetsColumns.TOTAL_LIQUIDITY]: ReactNode;
  [BorrowAssetsColumns.SEVEN_DAY_VOLUME]: ReactNode;
  [BorrowAssetsColumns.ACCOUNT_LIQUIDITY]?: ReactNode;
};

type PoolsTableProps = {
  variant: 'available-pools' | 'account-pools';
  pools: AccountLiquidityPool[];
  onRowAction: PoolsBaseTableProps['onRowAction'];
};

const PoolsTable = ({ variant, pools, onRowAction }: PoolsTableProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const isAccountPools = variant === 'account-pools';

  const commonColumns = [
    { name: t('amm.pools.pool_name'), uid: BorrowAssetsColumns.POOL_NAME },
    { name: t('apr'), uid: BorrowAssetsColumns.APR },
    { name: t('total_liquidity'), uid: BorrowAssetsColumns.TOTAL_LIQUIDITY },
    { name: t('7_day_volume'), uid: BorrowAssetsColumns.SEVEN_DAY_VOLUME }
  ];

  const borrowAssetsColumns = isAccountPools
    ? [...commonColumns, { name: t('my_liquidity'), uid: BorrowAssetsColumns.ACCOUNT_LIQUIDITY }]
    : commonColumns;

  const rows: PoolsTableRow[] = useMemo(
    () =>
      pools.map(({ data, amount }) => {
        const { pooledCurrencies, lpToken, apr } = data;
        const poolName = (
          <PoolName tickers={pooledCurrencies.map((pooledCurrencies) => pooledCurrencies.currency.ticker)} />
        );

        const totalLiquidity = convertMonetaryAmountToValueInUSD(
          newMonetaryAmount(200000000, GOVERNANCE_TOKEN),
          prices?.[GOVERNANCE_TOKEN.ticker].usd
        );

        const sevenDayVolumeUSD = convertMonetaryAmountToValueInUSD(
          newMonetaryAmount(200000000, GOVERNANCE_TOKEN),
          prices?.[GOVERNANCE_TOKEN.ticker].usd
        );

        const sevenDayVolume = (
          <MonetaryCell
            label={formatUSD(sevenDayVolumeUSD || 0, { compact: true })}
            alignItems={isAccountPools ? 'flex-start' : 'flex-end'}
          />
        );

        const accountLiquidity =
          variant === 'account-pools' && !!amount ? (
            <BalanceCell amount={amount} prices={prices} alignItems='flex-end' />
          ) : undefined;

        return {
          id: lpToken.ticker,
          poolName,
          apr: formatPercentage(apr.toNumber()),
          totalLiquidity,
          sevenDayVolume,
          accountLiquidity
        };
      }),
    [isAccountPools, pools, prices, variant]
  );

  return (
    <PoolsBaseTable
      title={isAccountPools ? t('amm.pools.my_pools') : t('amm.pools.other_pools')}
      onRowAction={onRowAction}
      rows={rows}
      columns={borrowAssetsColumns}
    />
  );
};

export { PoolsTable };
export type { PoolsTableProps };
