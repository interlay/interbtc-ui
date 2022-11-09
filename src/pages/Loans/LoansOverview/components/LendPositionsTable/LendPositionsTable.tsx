import { CurrencyExt, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatUSD } from '@/common/utils/utils';
import { Prices, useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { ApyCell, AssetCell, BalanceCell, LoansBaseTable, LoansBaseTableProps } from '../LoansBaseTable';
import { LendPositionColumns, LendPositionTableRow } from '../types';

const getAmountEarnedUSDI = (
  earnedInterest: MonetaryAmount<CurrencyExt>,
  earnedReward: MonetaryAmount<CurrencyExt> | null,
  prices?: Prices
) => {
  const earnedInterestUSD = earnedInterest.toBig().mul(prices?.[earnedInterest.currency.ticker].usd || 0);
  const earnedRewards = earnedReward?.toBig().mul(prices?.[earnedReward.currency.ticker].usd || 0) || 0;
  const accumulativeEarnedApy = earnedInterestUSD.add(earnedRewards);

  return formatUSD(accumulativeEarnedApy.toNumber());
};

// TODO: translations
const lendPositionColumns = [
  { name: 'Asset', uid: LendPositionColumns.ASSET },
  { name: 'APY / Earned', uid: LendPositionColumns.APY_EARNED },
  { name: 'Balance', uid: LendPositionColumns.BALANCE },
  { name: 'Collateral', uid: LendPositionColumns.COLLATERAL }
];

type LendPositionsTableProps = {
  assets: TickerToData<LoanAsset>;
  positions: LendPosition[];
  onRowAction: LoansBaseTableProps['onRowAction'];
};

const LendPositionsTable = ({ assets, positions, onRowAction }: LendPositionsTableProps): JSX.Element | null => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const lendPositionsTableRows: LendPositionTableRow[] = useMemo(
    () =>
      positions.map(({ amount, currency, earnedInterest, earnedReward }, key) => {
        const asset = <AssetCell currency={currency.ticker} />;

        const { lendApy, lendReward } = assets[currency.ticker];

        const accumulativeApy = lendApy.add(lendReward?.apy || 0);
        const amountEarnedUSD = getAmountEarnedUSDI(earnedInterest, earnedReward, prices);

        const apy = <ApyCell apy={accumulativeApy} amount={amountEarnedUSD} />;

        const balance = <BalanceCell amount={amount} prices={prices} />;

        return {
          id: key,
          asset,
          'apy-earned': apy,
          balance,
          // TODO: implement when switch is added
          collateral: null
        };
      }),
    [assets, positions, prices]
  );

  if (!lendPositionsTableRows.length) {
    return null;
  }

  return (
    <LoansBaseTable
      title={t('loans.my_lend_positions')}
      onRowAction={onRowAction}
      rows={lendPositionsTableRows}
      columns={lendPositionColumns}
    />
  );
};

export { LendPositionsTable };
export type { LendPositionsTableProps };
