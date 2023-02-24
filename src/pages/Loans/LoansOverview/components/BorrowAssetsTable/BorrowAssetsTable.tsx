import { LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { getTokenPrice } from '@/utils/helpers/prices';
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
  // ray test touch <
  const prices = useGetPrices();
  // ray test touch >

  const rows: BorrowAssetsTableRow[] = useMemo(
    () =>
      Object.values(assets).map(({ borrowApy, currency, availableCapacity, borrowReward, totalBorrows }) => {
        const asset = <AssetCell hasPadding currency={currency.ticker} />;

        const apy = (
          <ApyCell
            apy={borrowApy}
            currency={currency}
            rewards={borrowReward}
            prices={prices}
            isBorrow
            // TODO: temporary until we find why row click is being ignored
            onClick={() => onRowAction?.(currency.ticker as Key)}
          />
        );

        const availableCapacityUSD = convertMonetaryAmountToValueInUSD(
          availableCapacity,
          getTokenPrice(prices, availableCapacity.currency.ticker)?.usd
        );
        const capacity = <MonetaryCell label={formatUSD(availableCapacityUSD || 0, { compact: true })} />;

        const totalBorrowsUSD = convertMonetaryAmountToValueInUSD(
          totalBorrows,
          getTokenPrice(prices, totalBorrows.currency.ticker)?.usd
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
    [assets, prices, onRowAction]
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
