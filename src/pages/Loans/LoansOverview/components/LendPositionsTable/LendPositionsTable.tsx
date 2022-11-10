import { LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatPercentage } from '@/common/utils/utils';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { ApyCell, AssetCell, BalanceCell, LoansBaseTable, LoansBaseTableProps } from '../LoansBaseTable';
import { LendPositionColumns, LendPositionTableRow } from '../types';

// TODO: translations
const lendPositionColumns = [
  { name: 'Asset', uid: LendPositionColumns.ASSET },
  { name: 'APY', uid: LendPositionColumns.APY_EARNED },
  { name: 'Balance', uid: LendPositionColumns.BALANCE },
  { name: 'Collateral', uid: LendPositionColumns.COLLATERAL }
];

type LendPositionsTableProps = {
  assets: TickerToData<LoanAsset>;
  positions: LendPosition[];
  onRowAction: LoansBaseTableProps['onRowAction'];
};

const LendPositionsTable = ({ assets, positions, onRowAction }: LendPositionsTableProps): JSX.Element | null => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const lendPositionsTableRows: LendPositionTableRow[] = useMemo(
    () =>
      positions.map(({ amount, currency }, key) => {
        const asset = <AssetCell currency={currency.ticker} />;

        const { lendApy, lendReward } = assets[currency.ticker];

        const rewardsApy = lendReward
          ? `${lendReward.currency.ticker}: ${formatPercentage(lendReward.apy.toNumber() || 0, {
              maximumFractionDigits: 2
            })}`
          : undefined;

        const apy = <ApyCell apy={lendApy} amount={rewardsApy} />;

        const balance = <BalanceCell amount={amount} prices={prices} />;

        return {
          id: key,
          asset,
          'apy-earned': apy,
          balance,
          // TODO: implement when switch is added
          collateral: null
        };
      }),
    [assets, positions, prices]
  );

  if (!lendPositionsTableRows.length) {
    return null;
  }

  return (
    <LoansBaseTable
      title={t('loans.my_lend_positions')}
      onRowAction={onRowAction}
      rows={lendPositionsTableRows}
      columns={lendPositionColumns}
    />
  );
};

export { LendPositionsTable };
export type { LendPositionsTableProps };
