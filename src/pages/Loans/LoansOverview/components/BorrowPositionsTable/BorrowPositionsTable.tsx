import { LoanAsset, LoanPosition, TickerToData } from '@interlay/interbtc-api';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { ApyCell, AssetCell, BalanceCell, LoansBaseTable, LoansBaseTableProps } from '../LoansBaseTable';
import { MonetaryCell } from '../LoansBaseTable/MonetaryCell';
import { BorrowPositionColumns, BorrowPositionTableRow } from '../types';

// TODO: translations
const borrowPositionColumns = [
  { name: 'Asset', uid: BorrowPositionColumns.ASSET },
  { name: 'APY / Accrued', uid: BorrowPositionColumns.APY_ACCRUED },
  { name: 'Balance', uid: BorrowPositionColumns.BALANCE },
  { name: 'Status', uid: BorrowPositionColumns.STATUS }
];

type BorrowPositionsTableProps = {
  assets: TickerToData<LoanAsset>;
  positions: LoanPosition[];
  onRowAction: LoansBaseTableProps['onRowAction'];
};

const BorrowPositionsTable = ({ assets, positions, onRowAction }: BorrowPositionsTableProps): JSX.Element | null => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { getNewCollateralRatio } = useGetAccountLoansOverview();

  const borrowPositionsTableRows: BorrowPositionTableRow[] = useMemo(
    () =>
      positions.map(({ currency, amount }, key) => {
        const asset = <AssetCell currency={currency.ticker} />;

        // TODO: add when lib implents
        const apyEarned = `${0} ${currency.ticker}`;
        const apy = <ApyCell apy={assets[currency.ticker].borrowApy} amount={apyEarned} />;

        const balance = <BalanceCell amount={amount} prices={prices} />;

        const score = getNewCollateralRatio('borrow', currency, amount);
        const scoreLabel = score ? (score > 10 ? '+10' : score.toString()) : '-';

        const status = <MonetaryCell label={scoreLabel} alignItems='flex-end' />;

        return {
          id: key,
          asset,
          'apy-accrued': apy,
          balance,
          status
        };
      }),
    [assets, getNewCollateralRatio, positions, prices]
  );

  if (!borrowPositionsTableRows.length) {
    return null;
  }

  return (
    <LoansBaseTable
      title={t('loans.my_borrow_positions')}
      onRowAction={onRowAction}
      rows={borrowPositionsTableRows}
      columns={borrowPositionColumns}
    />
  );
};

export { BorrowPositionsTable };
export type { BorrowPositionsTableProps };
