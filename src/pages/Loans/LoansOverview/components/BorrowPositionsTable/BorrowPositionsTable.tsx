import { BorrowPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '@/common/utils/utils';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { useGetAccountHealthFactor } from '../../hooks/use-get-account-health-factor';
import { ApyCell, AssetCell, BalanceCell, LoansBaseTableProps } from '../LoansBaseTable';
import { StatusTag } from '../LoansBaseTable/LoanStatusTag';
import { StyledBorrowPositionsTable } from './BorrowPositionsTable.style';

enum BorrowPositionColumns {
  ASSET = 'asset',
  APY_ACCRUED = 'apy-accrued',
  BORROWED = 'borrowed',
  STATUS = 'status'
}

type BorrowPositionTableRow = {
  id: string;
  [BorrowPositionColumns.ASSET]: ReactNode;
  [BorrowPositionColumns.APY_ACCRUED]: ReactNode;
  [BorrowPositionColumns.BORROWED]: ReactNode;
  [BorrowPositionColumns.STATUS]: ReactNode;
};

// TODO: translations
const borrowPositionColumns = [
  { name: 'Asset', uid: BorrowPositionColumns.ASSET },
  { name: 'APY / Accrued', uid: BorrowPositionColumns.APY_ACCRUED },
  { name: 'Borrowed', uid: BorrowPositionColumns.BORROWED },
  { name: 'Status', uid: BorrowPositionColumns.STATUS }
];

type BorrowPositionsTableProps = {
  assets: TickerToData<LoanAsset>;
  positions: BorrowPosition[];
  onRowAction: LoansBaseTableProps['onRowAction'];
  disabledKeys: LoansBaseTableProps['disabledKeys'];
};

const BorrowPositionsTable = ({
  assets,
  positions,
  onRowAction,
  disabledKeys
}: BorrowPositionsTableProps): JSX.Element | null => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { data: healthFactorData } = useGetAccountHealthFactor();

  const rows: BorrowPositionTableRow[] = useMemo(
    () =>
      positions.map(({ currency, amount, accumulatedDebt }) => {
        const asset = <AssetCell currency={currency.ticker} />;

        const accrued = formatNumber(accumulatedDebt.toBig().toNumber(), {
          maximumFractionDigits: accumulatedDebt.currency.humanDecimals || 5
        });
        const accruedLabel = `${accrued} ${currency.ticker}`;
        const apy = <ApyCell apy={assets[currency.ticker].borrowApy} amount={accruedLabel} />;

        const borrowed = <BalanceCell amount={amount} prices={prices} />;

        const statusTag = healthFactorData ? (
          <StatusTag status={healthFactorData.status}>{healthFactorData.statusLabel}</StatusTag>
        ) : null;

        return {
          id: currency.ticker,
          asset,
          'apy-accrued': apy,
          borrowed,
          status: statusTag
        };
      }),
    [assets, healthFactorData, positions, prices]
  );

  return (
    <StyledBorrowPositionsTable
      title={t('loans.my_borrow_positions')}
      onRowAction={onRowAction}
      rows={rows}
      columns={borrowPositionColumns}
      disabledKeys={disabledKeys}
      emptyTitle='No borrow positions'
      emptyDescription='Your borrow positions will show here'
    />
  );
};

export { BorrowPositionsTable };
export type { BorrowPositionsTableProps };
