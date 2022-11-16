import { LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatPercentage } from '@/common/utils/utils';
import { Switch } from '@/component-library';
import { getSubsidyRewardApy } from '@/utils/helpers/loans';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { getSubsidyRewardApy } from '../../utils/get-subsidy-rewards-apy';
import { ApyCell, AssetCell, BalanceCell, LoansBaseTable, LoansBaseTableProps } from '../LoansBaseTable';
import { LendPositionColumns, LendPositionTableRow } from '../types';

// TODO: translations
const lendPositionColumns = [
  { name: 'Asset', uid: LendPositionColumns.ASSET },
  { name: 'APY', uid: LendPositionColumns.APY_EARNED },
  { name: 'Balance', uid: LendPositionColumns.BALANCE },
  { name: 'Collateral', uid: LendPositionColumns.COLLATERAL }
];

type LendPositionsTableProps = {
  assets: TickerToData<LoanAsset>;
  positions: LendPosition[];
  onRowAction: LoansBaseTableProps['onRowAction'];
  onPressCollateralSwitch: (ticker: string) => void;
  disabledKeys: LoansBaseTableProps['disabledKeys'];
};

const LendPositionsTable = ({
  assets,
  positions,
  onRowAction,
  onPressCollateralSwitch,
  disabledKeys
}: LendPositionsTableProps): JSX.Element | null => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const lendPositionsTableRows: LendPositionTableRow[] = useMemo(
    () =>
      positions.map(({ amount, currency, isCollateral }) => {
        const asset = <AssetCell currency={currency.ticker} />;

        const { lendApy, lendReward } = assets[currency.ticker];
        const rewardsApy = getSubsidyRewardApy(currency, lendReward, prices);
        const formattedRewardsApy = lendReward
          ? `${lendReward?.currency.ticker}: ${formatPercentage(rewardsApy || 0, {
              maximumFractionDigits: 2
            })}`
          : undefined;

        const apy = <ApyCell apy={lendApy} amount={formattedRewardsApy} />;

        const balance = <BalanceCell amount={amount} prices={prices} />;

        const collateral = (
          <Switch
            onPress={() => onPressCollateralSwitch(currency.ticker)}
            isSelected={isCollateral}
            aria-label={`toggle ${currency.ticker} collateral`}
          />
        );

        return {
          id: currency.ticker,
          asset,
          'apy-earned': apy,
          balance,
          collateral
        };
      }),
    [assets, onPressCollateralSwitch, positions, prices]
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
      disabledKeys={disabledKeys}
    />
  );
};

export { LendPositionsTable };
export type { LendPositionsTableProps };
