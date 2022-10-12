import { LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmount, formatNumber } from '@/common/utils/utils';
import { Span, Stack } from '@/component-library';

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
  data?: LoanAsset;
  position?: LendPosition;
};

const defaultAssetState: UseAssetState = { data: undefined, position: undefined };

type LendMarketProps = {
  assets: TickerToData<LoanAsset>;
  positions: LendPosition[];
};

const LendMarket = ({ assets, positions }: LendMarketProps): JSX.Element => {
  const { t } = useTranslation();
  const [selectedAsset, setAsset] = useState<UseAssetState>(defaultAssetState);

  // TODO: subject to change in the future
  const handleAssetRowAction = (key: Key) => {
    console.log('\n\n\n\nEVENT');
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

  const lendPositionsTableRows: LendPositionTableRow[] = positions.map(({ amount, currency, earnedInterest }, key) => {
    const asset = <MarketAsset currency={currency.ticker} />;

    return {
      id: key,
      asset,
      supplied: displayMonetaryAmount(amount),
      'supply-apy': `${formatNumber(assets[currency.ticker].lendApy.toNumber())}%`,
      'apy-earned': displayMonetaryAmount(earnedInterest)
    };
  });

  const lendAssetsTableRows: LendAssetsTableRow[] = Object.values(assets).map(
    ({ lendApy: apy, lendReward, currency }) => {
      const apyWithEarnedAssets = (
        <Stack spacing='half'>
          <Span>{apy.toString()}%</Span>
          <StyledApyTag>Earn: {lendReward?.currency.ticker}</StyledApyTag>
        </Stack>
      );

      const asset = <MarketAsset currency={currency.ticker} />;

      return {
        id: currency.ticker,
        asset,
        apy: apyWithEarnedAssets,
        'wallet-balance': '1' // TODO: add balance here balance
      };
    }
  );

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
