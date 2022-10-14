import { BorrowPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmount, formatNumber } from '@/common/utils/utils';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';

import { LoanModal } from '../LoanModal';
import { StyledTableWrapper } from './LoansMarkets.style';
import { MarketAsset } from './MarketAsset';
import { MarketTable } from './MarketTable';
import { BorrowAssetsColumns, BorrowAssetsTableRow, BorrowPositionColumns, BorrowPositionTableRow } from './types';

// TODO: translations
const borrowAssetsColumns = [
  { name: 'Asset', uid: BorrowAssetsColumns.ASSET },
  { name: 'APY', uid: BorrowAssetsColumns.BORROW_APY },
  { name: 'Available', uid: BorrowAssetsColumns.AVAILABLE },
  { name: 'Liquidity', uid: BorrowAssetsColumns.LIQUIDITY }
];

// TODO: translations
const borrowPositionColumns = [
  { name: 'Asset', uid: BorrowPositionColumns.ASSET },
  { name: 'Borrowed', uid: BorrowPositionColumns.BORROWED },
  { name: 'Borrow APY', uid: BorrowPositionColumns.BORROW_APY }
];

type UseAssetState = {
  data?: LoanAsset;
  position?: BorrowPosition;
};

const defaultAssetState: UseAssetState = { data: undefined, position: undefined };

type BorrowMarketProps = {
  assets: TickerToData<LoanAsset>;
  positions: BorrowPosition[];
};

const BorrowMarket = ({ assets, positions }: BorrowMarketProps): JSX.Element => {
  const { t } = useTranslation();
  const [selectedAsset, setAsset] = useState<UseAssetState>(defaultAssetState);

  const { getMaxBorrowableAmount } = useGetAccountLoansOverview();

  // TODO: subject to change in the future
  const handleAssetRowAction = (key: Key) => {
    const asset = assets[key as string];
    const position = positions.find((position) => position.currency === asset.currency);

    setAsset({ data: asset, position });
  };

  // TODO: subject to change in the future
  const handlePositionRowAction = (key: Key) => {
    const position = positions[key as number];
    const asset = assets[position.currency.ticker];

    setAsset({ data: asset, position });
  };

  const handleClose = () => setAsset(defaultAssetState);

  const borrowPositionsTableRows: BorrowPositionTableRow[] = positions.map(({ currency, amount }, key) => {
    const asset = <MarketAsset currency={currency.ticker} />;

    return {
      id: key,
      asset,
      'borrow-apy': `${formatNumber(assets[currency.ticker].borrowApy.toNumber())}%`,
      borrowed: displayMonetaryAmount(amount)
    };
  });

  const borrowAssetsTableRows: BorrowAssetsTableRow[] = Object.values(assets).map(
    ({ borrowApy: apy, availableCapacity, currency, totalLiquidity }) => {
      const asset = <MarketAsset currency={currency.ticker} />;

      const availableAmount = getMaxBorrowableAmount(currency, availableCapacity);

      return {
        id: currency.ticker,
        asset,
        'borrow-apy': formatNumber(apy.toNumber()),
        available: displayMonetaryAmount(availableAmount),
        liquidity: displayMonetaryAmount(totalLiquidity)
      };
    }
  );

  const hasBorrowPositions = !!borrowPositionsTableRows.length;

  return (
    <StyledTableWrapper spacing='double'>
      {hasBorrowPositions && (
        <MarketTable
          title={t('loans.my_borrow_positions')}
          onRowAction={handlePositionRowAction}
          rows={borrowPositionsTableRows}
          columns={borrowPositionColumns}
        />
      )}
      <MarketTable
        title={t('loans.borrow')}
        onRowAction={handleAssetRowAction}
        rows={borrowAssetsTableRows}
        columns={borrowAssetsColumns}
      />
      <LoanModal
        variant='borrow'
        open={!!selectedAsset.data}
        asset={selectedAsset.data}
        position={selectedAsset.position}
        onClose={handleClose}
      />
    </StyledTableWrapper>
  );
};

export { BorrowMarket };
export type { BorrowMarketProps };
