import { BorrowPosition, CollateralPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { useId } from '@react-aria/utils';
import { Key, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { Switch } from '@/component-library';
import { LoanType } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetAccountSubsidyRewards } from '@/utils/hooks/api/loans/use-get-account-subsidy-rewards';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { AssetCell, BalanceCell, Table, TableProps } from '../DataGrid';
import { ApyCell } from './ApyCell';
import { LoanTablePlaceholder } from './LoanTablePlaceholder';

enum LoanPositionTableColumns {
  ASSET = 'asset',
  APY = 'apy',
  AMOUNT = 'amount',
  COLLATERAL = 'collateral'
}

type LoanPositionTableRow = {
  id: string;
  [LoanPositionTableColumns.ASSET]: ReactNode;
  [LoanPositionTableColumns.APY]: ReactNode;
  [LoanPositionTableColumns.AMOUNT]: ReactNode;
  [LoanPositionTableColumns.COLLATERAL]?: ReactNode;
};

type Props = {
  variant?: LoanType;
  title?: ReactNode;
  assets: TickerToData<LoanAsset>;
  positions: BorrowPosition[] | CollateralPosition[];
  onPressCollateralSwitch?: (ticker: string) => void;
};

type InheritAttrs = Omit<TableProps, keyof Props | 'columns' | 'rows'>;

type LoanPositionsTableProps = Props & InheritAttrs;

const LoanPositionsTable = ({
  variant = 'lend',
  title,
  assets,
  positions,
  onRowAction,
  onPressCollateralSwitch,
  ...props
}: LoanPositionsTableProps): JSX.Element | null => {
  const titleId = useId();
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { data: subsidyRewards } = useGetAccountSubsidyRewards();

  const isLending = variant === 'lend';
  const showCollateral = !!onPressCollateralSwitch && isLending;

  const columns = useMemo(() => {
    if (isLending) {
      const lendingColumns = [
        { name: 'Asset', uid: LoanPositionTableColumns.ASSET },
        { name: 'APY / Earned', uid: LoanPositionTableColumns.APY },
        { name: 'Supplied', uid: LoanPositionTableColumns.AMOUNT }
      ];

      if (showCollateral) {
        lendingColumns.push({ name: 'Collateral', uid: LoanPositionTableColumns.COLLATERAL });
      }

      return lendingColumns;
    }

    return [
      { name: 'Asset', uid: LoanPositionTableColumns.ASSET },
      { name: 'APY / Accrued', uid: LoanPositionTableColumns.APY },
      { name: 'Borrowed', uid: LoanPositionTableColumns.AMOUNT }
    ];
  }, [isLending, showCollateral]);

  const rows: LoanPositionTableRow[] = useMemo(
    () =>
      positions.map(({ amount: amountProp, ...position }) => {
        const { currency } = amountProp;
        const asset = <AssetCell ticker={currency.ticker} />;

        const { borrowApy, lendApy, lendReward, borrowReward } = assets[currency.ticker];

        const apyCellProps = isLending
          ? {
              apy: lendApy,
              rewardsPerYear: lendReward,
              accruedRewards: subsidyRewards ? subsidyRewards.perMarket[currency.ticker].lend : null
            }
          : {
              apy: borrowApy,
              rewardsPerYear: borrowReward,
              accruedRewards: subsidyRewards ? subsidyRewards.perMarket[currency.ticker].borrow : null,
              accumulatedDebt: (position as BorrowPosition).accumulatedDebt,
              isBorrow: true
            };

        const apy = (
          <ApyCell
            {...apyCellProps}
            currency={currency}
            prices={prices}
            // TODO: temporary until we find why row click is being ignored
            onClick={() => onRowAction?.(currency.ticker as Key)}
          />
        );

        const amountUSD = amountProp
          ? convertMonetaryAmountToValueInUSD(amountProp, getTokenPrice(prices, currency.ticker)?.usd)
          : 0;

        const amount = (
          <BalanceCell
            alignItems={isLending && onPressCollateralSwitch ? undefined : 'flex-end'}
            amount={amountProp}
            amountUSD={amountUSD || 0}
          />
        );

        const collateral = showCollateral ? (
          <Switch
            onPress={() => onPressCollateralSwitch?.(currency.ticker)}
            isSelected={(position as CollateralPosition).isCollateral}
            aria-label={`toggle ${currency.ticker} collateral`}
          />
        ) : undefined;

        return {
          id: currency.ticker,
          asset,
          apy,
          amount,
          collateral
        };
      }),
    [assets, isLending, onPressCollateralSwitch, onRowAction, positions, prices, showCollateral, subsidyRewards]
  );

  return (
    <Table
      title={title || (isLending ? t('loans.my_lend_positions') : t('loans.my_borrow_positions'))}
      titleId={titleId}
      onRowAction={onRowAction}
      rows={rows}
      columns={columns}
      placeholder={<LoanTablePlaceholder variant={variant} />}
      {...props}
    />
  );
};

export { LoanPositionsTable };
export type { LoanPositionsTableProps };
