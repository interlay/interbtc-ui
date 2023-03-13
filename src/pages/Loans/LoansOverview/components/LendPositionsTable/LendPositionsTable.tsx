import { LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Switch } from '@/component-library';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { ApyCell, AssetCell, BalanceCell, LoansBaseTableProps } from '../LoansBaseTable';
import { StyledLendPositionsTable } from './LendPositionsTable.style';

enum LendPositionColumns {
  ASSET = 'asset',
  APY_EARNED = 'apy-earned',
  SUPPLIED = 'supplied',
  COLLATERAL = 'collateral'
}

type LendPositionTableRow = {
  id: string;
  [LendPositionColumns.ASSET]: ReactNode;
  [LendPositionColumns.APY_EARNED]: ReactNode;
  [LendPositionColumns.SUPPLIED]: ReactNode;
  [LendPositionColumns.COLLATERAL]: ReactNode;
};

// TODO: translations
const lendPositionColumns = [
  { name: 'Asset', uid: LendPositionColumns.ASSET },
  { name: 'APY / Earned', uid: LendPositionColumns.APY_EARNED },
  { name: 'Supplied', uid: LendPositionColumns.SUPPLIED },
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

  const rows: LendPositionTableRow[] = useMemo(
    () =>
      positions.map(({ amount, currency, earnedInterest, isCollateral }: any) => {
        const asset = <AssetCell currency={currency.ticker} />;

        const { lendApy, lendReward } = assets[currency.ticker];

        const apy = (
          <ApyCell
            apy={lendApy}
            currency={currency}
            prices={prices}
            rewards={lendReward}
            earnedInterest={earnedInterest}
            // TODO: temporary until we find why row click is being ignored
            onClick={() => onRowAction?.(currency.ticker as Key)}
          />
        );

        const supplied = <BalanceCell amount={amount} prices={prices} />;

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
          supplied,
          collateral
        };
      }),
    [assets, onPressCollateralSwitch, onRowAction, positions, prices]
  );

  return (
    <StyledLendPositionsTable
      title={t('loans.my_lend_positions')}
      onRowAction={onRowAction}
      rows={rows}
      columns={lendPositionColumns}
      disabledKeys={disabledKeys}
      emptyTitle='No lend positions'
      emptyDescription='Your lend positions will show here'
    />
  );
};

export { LendPositionsTable };
export type { LendPositionsTableProps };
