import { BorrowPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat, formatPercentage } from '@/common/utils/utils';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { LoanModal } from '../LoanModal';
import { AssetCell } from './AssetCell';
import { StyledTableWrapper } from './LoansMarkets.style';
import { MarketTable } from './MarketTable';
import { MonetaryCell } from './MonetaryCell';
import { BorrowAssetsColumns, BorrowAssetsTableRow, BorrowPositionColumns, BorrowPositionTableRow } from './types';

// TODO: translations
const borrowAssetsColumns = [
  { name: 'Asset', uid: BorrowAssetsColumns.ASSET },
  { name: 'APY', uid: BorrowAssetsColumns.APY },
  { name: 'Wallet', uid: BorrowAssetsColumns.WALLET },
  { name: 'Liquidity', uid: BorrowAssetsColumns.LIQUIDITY }
];

// TODO: translations
const borrowPositionColumns = [
  { name: 'Asset', uid: BorrowPositionColumns.ASSET },
  { name: 'APY / Accrued', uid: BorrowPositionColumns.APY_ACCRUED },
  { name: 'Balance', uid: BorrowPositionColumns.BALANCE },
  { name: 'Status', uid: BorrowPositionColumns.STATUS }
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
  const { data: balances } = useGetBalances();
  const prices = useGetPrices();
  const { getNewCollateralRatio } = useGetAccountLoansOverview();

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
    const asset = <AssetCell currency={currency.ticker} />;

    const apyPercentage = formatPercentage(assets[currency.ticker].borrowApy.toNumber());
    const apyEarned = `${0} ${currency.ticker}`;

    const apy = <MonetaryCell label={apyPercentage} sublabel={apyEarned} />;

    const assetBalanceUSD = displayMonetaryAmountInUSDFormat(amount, prices?.[amount.currency.ticker].usd);
    const assetBalance = `${displayMonetaryAmount(amount)} ${amount.currency.ticker}`;

    const balance = <MonetaryCell label={assetBalanceUSD} sublabel={assetBalance} />;

    const score = getNewCollateralRatio('borrow', currency, amount);

    return {
      id: key,
      asset,
      'apy-accrued': apy,
      balance,
      status: score ? (score > 10 ? '+10' : score.toString()) : '-'
    };
  });

  const availableAssets = Object.values(assets).filter(
    (asset) => !positions.find((position) => position.currency.ticker === asset.currency.ticker)
  );

  const borrowAssetsTableRows: BorrowAssetsTableRow[] = Object.values(availableAssets).map(
    ({ borrowApy: apy, currency, totalLiquidity }) => {
      const asset = <AssetCell currency={currency.ticker} />;

      const walletBalance = balances ? displayMonetaryAmount(balances[currency.ticker].free) : '0';
      const wallet = `${walletBalance} ${currency.ticker}`;

      return {
        id: currency.ticker,
        asset,
        apy: formatPercentage(apy.toNumber()),
        wallet,
        liquidity: displayMonetaryAmountInUSDFormat(totalLiquidity, prices?.[totalLiquidity.currency.ticker].usd)
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
