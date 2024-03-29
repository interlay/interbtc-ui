import { LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { useId } from '@react-aria/utils';
import { Key, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { Cell, Table, TableProps } from '@/components';
import { LoanApyCell, LoanTablePlaceholder } from '@/components/LoanPositionsTable';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { getTokenPrice } from '@/utils/helpers/prices';

import { StyledAssetCell } from './BorrowAssetsTable.style';

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

type Props = {
  assets: TickerToData<LoanAsset>;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type BorrowAssetsTableProps = Props & InheritAttrs;

const BorrowAssetsTable = ({ assets, onRowAction, ...props }: BorrowAssetsTableProps): JSX.Element => {
  const titleId = useId();
  const { t } = useTranslation();
  const prices = useGetPrices();

  // TODO: translations
  const borrowAssetsColumns = useMemo(
    () => [
      { name: t('asset'), uid: BorrowAssetsColumns.ASSET },
      { name: t('apy'), uid: BorrowAssetsColumns.APY },
      { name: t('available'), uid: BorrowAssetsColumns.CAPACITY },
      { name: t('loans.borrowed'), uid: BorrowAssetsColumns.TOTAL_BORROWED }
    ],
    [t]
  );

  const rows: BorrowAssetsTableRow[] = useMemo(
    () =>
      Object.values(assets).map(({ borrowApy, currency, availableCapacity, totalBorrows, borrowReward }) => {
        const asset = <StyledAssetCell ticker={currency.ticker} />;

        const apy = (
          <LoanApyCell
            apy={borrowApy}
            currency={currency}
            rewardsPerYear={borrowReward}
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
        const capacity = <Cell label={formatUSD(availableCapacityUSD || 0, { compact: true })} />;

        const totalBorrowsUSD = convertMonetaryAmountToValueInUSD(
          totalBorrows,
          getTokenPrice(prices, totalBorrows.currency.ticker)?.usd
        );
        const totalBorrowed = <Cell label={formatUSD(totalBorrowsUSD || 0, { compact: true })} alignItems='flex-end' />;

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
    <Table
      {...props}
      title={t('loans.borrow_markets')}
      titleId={titleId}
      rows={rows}
      columns={borrowAssetsColumns}
      placeholder={<LoanTablePlaceholder variant='borrow' />}
      onRowAction={onRowAction}
    />
  );
};

export { BorrowAssetsTable };
export type { BorrowAssetsTableProps };
