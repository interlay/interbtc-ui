import { BorrowPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { ApyCell, AssetCell, BalanceCell, LoansBaseTableProps } from '../LoansBaseTable';
import { StyledBorrowPositionsTable } from './BorrowPositionsTable.style';

enum BorrowPositionColumns {
  ASSET = 'asset',
  APY_ACCRUED = 'apy-accrued',
  BORROWED = 'borrowed',
  EMPTY = 'empty'
}

type BorrowPositionTableRow = {
  id: string;
  [BorrowPositionColumns.ASSET]: ReactNode;
  [BorrowPositionColumns.APY_ACCRUED]: ReactNode;
  [BorrowPositionColumns.BORROWED]: ReactNode;
  [BorrowPositionColumns.EMPTY]: ReactNode;
};

// TODO: translations
const borrowPositionColumns = [
  { name: 'Asset', uid: BorrowPositionColumns.ASSET },
  { name: 'APY / Accrued', uid: BorrowPositionColumns.APY_ACCRUED },
  { name: 'Borrowed', uid: BorrowPositionColumns.BORROWED },
  { name: '', uid: BorrowPositionColumns.EMPTY }
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

  const rows: BorrowPositionTableRow[] = useMemo(
    () =>
      positions.map(({ currency, amount, accumulatedDebt }) => {
        const asset = <AssetCell currency={currency.ticker} />;

        const { borrowApy, borrowReward } = assets[currency.ticker];

        const apy = (
          <ApyCell
            apy={borrowApy}
            currency={currency}
            rewards={borrowReward}
            accumulatedDebt={accumulatedDebt}
            prices={prices}
            isBorrow
            // TODO: temporary until we find why row click is being ignored
            onClick={() => onRowAction?.(currency.ticker as Key)}
          />
        );

        const borrowed = <BalanceCell amount={amount} prices={prices} />;

        return {
          id: currency.ticker,
          asset,
          'apy-accrued': apy,
          borrowed,
          empty: null
        };
      }),
    [assets, onRowAction, positions, prices]
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
