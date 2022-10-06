import { CurrencyIdLiteral } from '@interlay/interbtc-api';
import { Key, useState } from 'react';

import { CoinIcon, Span, Stack } from '@/component-library';
import { Icon } from '@/component-library/Icon';
import { SupplyAssetData, SupplyPositionData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { SupplyModal } from '../SupplyModal';
import { StyledApyTag, StyledAsset, StyledTableWrapper } from './LoansMarkets.style';
import { MarketTable } from './MarketTable';
import { SupplyAssetsColumns, SupplyAssetsTableRow, SupplyPositionColumns, SupplyPositionTableRow } from './types';

// TODO: translations
const supplyAssetsColumns = [
  { name: 'Asset', uid: SupplyAssetsColumns.ASSET },
  { name: 'APY', uid: SupplyAssetsColumns.APY },
  { name: 'Wallet Balance', uid: SupplyAssetsColumns.WALLET_BALANCE },
  { name: '', uid: SupplyAssetsColumns.END_ADORNMENT }
];

// TODO: translations
const supplyPositionColumns = [
  { name: 'Asset', uid: SupplyPositionColumns.ASSET },
  { name: 'Supplied', uid: SupplyPositionColumns.SUPPLIED },
  { name: 'Supply APY', uid: SupplyPositionColumns.SUPPLY_APY },
  { name: 'APY Earned', uid: SupplyPositionColumns.SUPPLY_APY },
  { name: '', uid: SupplyPositionColumns.END_ADORNMENT }
];

type UseAssetState = {
  data?: SupplyAssetData;
  position?: SupplyPositionData;
};

const defaultAssetState: UseAssetState = { data: undefined, position: undefined };

type SupplyMarketProps = {
  assets: SupplyAssetData[];
  positions: SupplyPositionData[];
};

const MarketAsset = ({ currency }: { currency: CurrencyIdLiteral }): JSX.Element => (
  <StyledAsset>
    <CoinIcon coin={currency} size='small' />
    <Span>{currency}</Span>
  </StyledAsset>
);

const SupplyMarket = ({ assets, positions }: SupplyMarketProps): JSX.Element => {
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

  const supplyPositionsTableRows: SupplyPositionTableRow[] = positions.map(
    ({ apy, amount, currency, apyEarned }, key) => {
      const asset = <MarketAsset currency={currency} />;

      return {
        id: key,
        asset,
        supplied: amount,
        'supply-apy': apy,
        'apy-earned': apyEarned,
        'end-adornment': <Icon variant='chevron-right' width='1.5rem' height='1.5rem' />
      };
    }
  );

  const supplyAssetsTableRows: SupplyAssetsTableRow[] = assets.map(({ apy, apyAssets, currency, balance }, key) => {
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
      'wallet-balance': balance,
      'end-adornment': <Icon variant='chevron-right' width='1.5rem' height='1.5rem' />
    };
  });

  const hasSupplyPositions = !!supplyPositionsTableRows.length;

  return (
    <StyledTableWrapper spacing='double'>
      {hasSupplyPositions && (
        <MarketTable
          title='My Lend Positions'
          onRowAction={handlePositionRowAction}
          rows={supplyPositionsTableRows}
          columns={supplyPositionColumns}
        />
      )}
      <MarketTable
        title='Lend'
        onRowAction={handleAssetRowAction}
        rows={supplyAssetsTableRows}
        columns={supplyAssetsColumns}
      />
      <SupplyModal
        open={!!selectedAsset.data}
        asset={selectedAsset.data}
        position={selectedAsset.position}
        onClose={handleClose}
      />
    </StyledTableWrapper>
  );
};

export { SupplyMarket };
export type { SupplyAssetsTableRow, SupplyMarketProps, SupplyPositionTableRow };
