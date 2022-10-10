import { Key, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BorrowAssetData, BorrowPositionData } from '@/utils/hooks/api/loans/use-get-loans-data';

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
  data?: BorrowAssetData;
  position?: BorrowPositionData;
};

const defaultAssetState: UseAssetState = { data: undefined, position: undefined };

type BorrowMarketProps = {
  assets: BorrowAssetData[];
  positions: BorrowPositionData[];
};

const BorrowMarket = ({ assets, positions }: BorrowMarketProps): JSX.Element => {
  const { t } = useTranslation();
  const [selectedAsset, setAsset] = useState<UseAssetState>(defaultAssetState);

  // TODO: subject to change in the future
  const handleAssetRowAction = (key: Key) => {
    const asset = assets[key as number];
    const position = positions.find((position) => position.currency === asset.currency);

    setAsset({ data: asset, position });
  };

  // TODO: subject to change in the future
  const handlePositionRowAction = (key: Key) => {
    const position = positions[key as number];
    const asset = assets.find((asset) => asset.currency === position.currency);

    setAsset({ data: asset, position });
  };

  const handleClose = () => setAsset(defaultAssetState);

  const borrowPositionsTableRows: BorrowPositionTableRow[] = positions.map(({ currency, amount, apy }, key) => {
    const asset = <MarketAsset currency={currency} />;

    return {
      id: key,
      asset,
      'borrow-apy': apy,
      borrowed: amount
    };
  });

  const borrowAssetsTableRows: BorrowAssetsTableRow[] = assets.map(({ apy, available, currency, liquidity }, key) => {
    const asset = <MarketAsset currency={currency} />;

    return {
      id: key,
      asset,
      'borrow-apy': apy,
      available,
      liquidity
    };
  });

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
