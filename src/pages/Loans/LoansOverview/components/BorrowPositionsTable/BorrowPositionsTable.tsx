import { LoanAsset, LoanPosition, TickerToData } from '@interlay/interbtc-api';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';
import { useGetLoansData } from '@/utils/hooks/api/loans/use-get-loans-data';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { getStatus, getStatusLabel } from '../../utils/get-status';
import { ApyCell, AssetCell, BalanceCell, LoansBaseTable, LoansBaseTableProps } from '../LoansBaseTable';
import { StatusTag } from '../LoansBaseTable/LoanStatusTag';
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
  const { thresholds } = useGetLoansData();
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
        const status = getStatus(score, thresholds);
        const statusLabel = getStatusLabel(status);
        const statusTag = <StatusTag status={status}>{statusLabel}</StatusTag>;

        return {
          id: key,
          asset,
          'apy-accrued': apy,
          balance,
          status: statusTag
        };
      }),
    [assets, getNewCollateralRatio, positions, prices, thresholds]
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
