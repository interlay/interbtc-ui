import { LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { ApyCell, AssetCell, LoansBaseTable, LoansBaseTableProps } from '../LoansBaseTable';
import { MonetaryCell } from '../LoansBaseTable/MonetaryCell';

enum BorrowAssetsColumns {
  ASSET = 'asset',
  APY = 'apy',
  CAPACITY = 'capacity',
  TOTAL_BORROWED = 'totalBorrowed'
}

type BorrowAssetsTableRow = {
  id: string;
  [BorrowAssetsColumns.ASSET]: ReactNode;
  [BorrowAssetsColumns.APY]: ReactNode;
  [BorrowAssetsColumns.CAPACITY]: ReactNode;
  [BorrowAssetsColumns.TOTAL_BORROWED]: ReactNode;
};

// TODO: translations
const borrowAssetsColumns = [
  { name: 'Asset', uid: BorrowAssetsColumns.ASSET },
  { name: 'APY', uid: BorrowAssetsColumns.APY },
  { name: 'Capacity', uid: BorrowAssetsColumns.CAPACITY },
  { name: 'Total Borrowed', uid: BorrowAssetsColumns.TOTAL_BORROWED }
];

type BorrowAssetsTableProps = {
  assets: TickerToData<LoanAsset>;
  onRowAction: LoansBaseTableProps['onRowAction'];
  disabledKeys: LoansBaseTableProps['disabledKeys'];
};

const BorrowAssetsTable = ({ assets, onRowAction, disabledKeys }: BorrowAssetsTableProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const rows: BorrowAssetsTableRow[] = useMemo(
    () =>
      Object.values(assets).map(({ borrowApy, currency, availableCapacity, totalBorrows }) => {
        const asset = <AssetCell currency={currency.ticker} />;

        const apy = <ApyCell apy={borrowApy} />;

        const availableCapacityUSD = convertMonetaryAmountToValueInUSD(
          availableCapacity,
          prices?.[availableCapacity.currency.ticker].usd
        );
        const capacity = <MonetaryCell label={formatUSD(availableCapacityUSD || 0, { compact: true })} />;

        const totalBorrowsUSD = convertMonetaryAmountToValueInUSD(
          totalBorrows,
          prices?.[totalBorrows.currency.ticker].usd
        );
        const totalBorrowed = (
          <MonetaryCell label={formatUSD(totalBorrowsUSD || 0, { compact: true })} alignItems='flex-end' />
        );

        return {
          id: currency.ticker,
          asset,
          apy,
          capacity,
          totalBorrowed
        };
      }),
    [assets, prices]
  );

  return (
    <LoansBaseTable
      title={t('loans.borrow_markets')}
      onRowAction={onRowAction}
      rows={rows}
      columns={borrowAssetsColumns}
      disabledKeys={disabledKeys}
    />
  );
};

export { BorrowAssetsTable };
export type { BorrowAssetsTableProps };
