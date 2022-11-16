import { LendPosition, LoanAsset, newMonetaryAmount, TickerToData } from '@interlay/interbtc-api';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatPercentage, formatUSD } from '@/common/utils/utils';
import { getSubsidyRewardApy } from '@/utils/helpers/loans';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { getSubsidyRewardApy } from '../../utils/get-subsidy-rewards-apy';
import { ApyCell, AssetCell, BalanceCell, LoansBaseTable, LoansBaseTableProps } from '../LoansBaseTable';
import { MonetaryCell } from '../LoansBaseTable/MonetaryCell';
import { LendAssetsColumns, LendAssetsTableRow } from '../types';

// TODO: translations
const lendAssetsColumns = [
  { name: 'Asset', uid: LendAssetsColumns.ASSET },
  { name: 'APY', uid: LendAssetsColumns.APY },
  { name: 'Wallet', uid: LendAssetsColumns.WALLET },
  { name: 'Liquidity', uid: LendAssetsColumns.LIQUIDITY }
];

type LendAssetsTableProps = {
  assets: TickerToData<LoanAsset>;
  positions: LendPosition[];
  onRowAction: LoansBaseTableProps['onRowAction'];
  disabledKeys: LoansBaseTableProps['disabledKeys'];
};

const LendAssetsTable = ({ assets, positions, onRowAction, disabledKeys }: LendAssetsTableProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { data: balances } = useGetBalances();

  const availableAssets = useMemo(
    () =>
      Object.values(assets).filter(
        (asset) => !positions.find((position) => position.currency.ticker === asset.currency.ticker)
      ),
    [assets, positions]
  );

  const lendAssetsTableRows: LendAssetsTableRow[] = useMemo(
    () =>
      availableAssets.map(({ lendApy, lendReward, currency, totalLiquidity }) => {
        const asset = <AssetCell currency={currency.ticker} />;

        const rewardsApy = getSubsidyRewardApy(currency, lendReward, prices);
        const formattedRewardsApy = lendReward
          ? `${lendReward?.currency.ticker}: ${formatPercentage(rewardsApy || 0, {
              maximumFractionDigits: 2
            })}`
          : undefined;

        const apy = <ApyCell apy={lendApy} amount={formattedRewardsApy} />;

        const amount = balances ? balances[currency.ticker].free : newMonetaryAmount(0, currency);
        const wallet = <BalanceCell amount={amount} prices={prices} />;

        const liquidityUSDValue = convertMonetaryAmountToValueInUSD(
          totalLiquidity,
          prices?.[totalLiquidity.currency.ticker].usd
        );
        const liquidityLabel = liquidityUSDValue || 0;
        const liquidity = <MonetaryCell label={formatUSD(liquidityLabel, { compact: true })} alignItems='flex-end' />;

        return {
          id: currency.ticker,
          asset,
          apy,
          wallet,
          liquidity
        };
      }),
    [availableAssets, balances, prices]
  );

  return (
    <LoansBaseTable
      title={t('loans.lend_markets')}
      onRowAction={onRowAction}
      rows={lendAssetsTableRows}
      columns={lendAssetsColumns}
      disabledKeys={disabledKeys}
    />
  );
};

export { LendAssetsTable };
export type { LendAssetsTableProps };
