import { Key, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Span, Stack } from '@/component-library';
import { LendAssetData, LendPositionData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { LoanModal } from '../LoanModal';
import { StyledApyTag, StyledTableWrapper } from './LoansMarkets.style';
import { MarketAsset } from './MarketAsset';
import { MarketTable } from './MarketTable';
import { LendAssetsColumns, LendAssetsTableRow, LendPositionColumns, LendPositionTableRow } from './types';

// TODO: translations
const lendAssetsColumns = [
  { name: 'Asset', uid: LendAssetsColumns.ASSET },
  { name: 'APY', uid: LendAssetsColumns.APY },
  { name: 'Wallet Balance', uid: LendAssetsColumns.WALLET_BALANCE }
];

// TODO: translations
const lendPositionColumns = [
  { name: 'Asset', uid: LendPositionColumns.ASSET },
  { name: 'Supplied', uid: LendPositionColumns.SUPPLIED },
  { name: 'Supply APY', uid: LendPositionColumns.SUPPLY_APY },
  { name: 'APY Earned', uid: LendPositionColumns.APY_EARNED }
];

type UseAssetState = {
  data?: LendAssetData;
  position?: LendPositionData;
};

const defaultAssetState: UseAssetState = { data: undefined, position: undefined };

type LendMarketProps = {
  assets: LendAssetData[];
  positions: LendPositionData[];
};

const LendMarket = ({ assets, positions }: LendMarketProps): JSX.Element => {
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

  const lendPositionsTableRows: LendPositionTableRow[] = positions.map(({ apy, amount, currency, apyEarned }, key) => {
    const asset = <MarketAsset currency={currency} />;

    return {
      id: key,
      asset,
      supplied: amount,
      'supply-apy': apy,
      'apy-earned': apyEarned
    };
  });

  const lendAssetsTableRows: LendAssetsTableRow[] = assets.map(({ apy, apyAssets, currency, balance }, key) => {
    const apyWithEarnedAssets = (
      <Stack spacing='half'>
        <Span>{apy}</Span>
        <StyledApyTag>Earn: {apyAssets.join(' / ')}</StyledApyTag>
      </Stack>
    );

    const asset = <MarketAsset currency={currency} />;

    return {
      id: key,
      asset,
      apy: apyWithEarnedAssets,
      'wallet-balance': balance
    };
  });

  const hasLendPositions = !!lendPositionsTableRows.length;

  return (
    <StyledTableWrapper spacing='double'>
      {hasLendPositions && (
        <MarketTable
          title={t('loans.my_lend_positions')}
          onRowAction={handlePositionRowAction}
          rows={lendPositionsTableRows}
          columns={lendPositionColumns}
        />
      )}
      <MarketTable
        title={t('loans.lend')}
        onRowAction={handleAssetRowAction}
        rows={lendAssetsTableRows}
        columns={lendAssetsColumns}
      />
      <LoanModal
        variant='lend'
        open={!!selectedAsset.data}
        asset={selectedAsset.data}
        position={selectedAsset.position}
        onClose={handleClose}
      />
    </StyledTableWrapper>
  );
};

export { LendMarket };
export type { LendMarketProps };
