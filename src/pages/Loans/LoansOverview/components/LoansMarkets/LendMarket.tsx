import { LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat, formatPercentage } from '@/common/utils/utils';
import { Span, Stack } from '@/component-library';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { LoanModal } from '../LoanModal';
import { AssetCell } from './AssetCell';
import { StyledApyTag, StyledTableWrapper } from './LoansMarkets.style';
import { MarketTable } from './MarketTable';
import { MonetaryCell } from './MonetaryCell';
import { LendAssetsColumns, LendAssetsTableRow, LendPositionColumns, LendPositionTableRow } from './types';

// TODO: translations
const lendAssetsColumns = [
  { name: 'Asset', uid: LendAssetsColumns.ASSET },
  { name: 'APY', uid: LendAssetsColumns.APY },
  { name: 'Wallet', uid: LendAssetsColumns.WALLET },
  { name: 'Collateral', uid: LendAssetsColumns.COLLATERAL }
];

// TODO: translations
const lendPositionColumns = [
  { name: 'Asset', uid: LendPositionColumns.ASSET },
  { name: 'APY / Earned', uid: LendPositionColumns.APY_EARNED },
  { name: 'Balance', uid: LendPositionColumns.BALANCE },
  { name: 'Collateral', uid: LendAssetsColumns.COLLATERAL }
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
  const { data: balances } = useGetBalances();
  const prices = useGetPrices();

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

  const lendPositionsTableRows: LendPositionTableRow[] = positions.map(({ amount, currency, earnedInterest }, key) => {
    const asset = <AssetCell currency={currency.ticker} />;

    const apyPercentage = formatPercentage(assets[currency.ticker].lendApy.toNumber());
    const apyEarned = `${displayMonetaryAmount(earnedInterest)} ${earnedInterest.currency.ticker}`;

    const apy = <MonetaryCell label={apyPercentage} sublabel={apyEarned} />;

    const assetBalanceUSD = displayMonetaryAmountInUSDFormat(amount, prices?.[amount.currency.ticker].usd);
    const assetBalance = `${displayMonetaryAmount(amount)} ${amount.currency.ticker}`;

    const balance = <MonetaryCell label={assetBalanceUSD} sublabel={assetBalance} />;

    return {
      id: key,
      asset,
      'apy-earned': apy,
      balance,
      // TODO: implement when switch is added
      collateral: null
    };
  });

  const availableAssets = Object.values(assets).filter(
    (asset) => !positions.find((position) => position.currency.ticker === asset.currency.ticker)
  );

  const lendAssetsTableRows: LendAssetsTableRow[] = availableAssets.map(({ lendApy: apy, lendReward, currency }) => {
    const apyWithEarnedAssets = (
      <Stack spacing='none'>
        <Span>{formatPercentage(apy.toNumber())}</Span>
        {lendReward && <StyledApyTag>Earn: {lendReward.currency.ticker}</StyledApyTag>}
      </Stack>
    );

    const asset = <AssetCell currency={currency.ticker} />;

    const walletBalance = balances ? displayMonetaryAmount(balances[currency.ticker].free) : '0';
    const wallet = `${walletBalance} ${currency.ticker}`;

    return {
      id: currency.ticker,
      asset,
      apy: apyWithEarnedAssets,
      wallet,
      collateral: null
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
