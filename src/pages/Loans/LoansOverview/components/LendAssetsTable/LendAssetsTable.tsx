import { LendPosition, LoanAsset, newMonetaryAmount, TickerToData } from '@interlay/interbtc-api';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { ApyCell, AssetCell, BalanceCell, LoansBaseTable, LoansBaseTableProps } from '../LoansBaseTable';
import { LendAssetsColumns, LendAssetsTableRow } from '../types';

// TODO: translations
const lendAssetsColumns = [
  { name: 'Asset', uid: LendAssetsColumns.ASSET },
  { name: 'APY', uid: LendAssetsColumns.APY },
  { name: 'Wallet', uid: LendAssetsColumns.WALLET },
  { name: 'Collateral', uid: LendAssetsColumns.COLLATERAL }
];

type LendAssetsTableProps = {
  assets: TickerToData<LoanAsset>;
  positions: LendPosition[];
  onRowAction: LoansBaseTableProps['onRowAction'];
};

const LendAssetsTable = ({ assets, positions, onRowAction }: LendAssetsTableProps): JSX.Element => {
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
      availableAssets.map(({ lendApy, lendReward, currency }) => {
        const asset = <AssetCell currency={currency.ticker} />;

        const accumulativeApy = lendApy.add(lendReward?.apy || 0);
        const apy = <ApyCell apy={accumulativeApy} />;

        const amount = balances ? balances[currency.ticker].free : newMonetaryAmount(0, currency);
        const wallet = <BalanceCell amount={amount} prices={prices} />;

        return {
          id: currency.ticker,
          asset,
          apy,
          wallet,
          collateral: null
        };
      }),
    [availableAssets, balances, prices]
  );

  return (
    <LoansBaseTable
      title={t('loans.lend')}
      onRowAction={onRowAction}
      rows={lendAssetsTableRows}
      columns={lendAssetsColumns}
    />
  );
};

export { LendAssetsTable };
export type { LendAssetsTableProps };
