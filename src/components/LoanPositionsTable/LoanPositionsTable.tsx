import { BorrowPosition, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { Key, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { Card, Flex, P, Strong, Switch } from '@/component-library';
import { LoanType } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { AssetCell, BalanceCell, Table, TableProps } from '../Table';
import { ApyCell } from './ApyCell';

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

type LoanPositionsTableProps = {
  variant?: LoanType;
  title?: ReactNode;
  assets: TickerToData<LoanAsset>;
  positions: BorrowPosition[] | LendPosition[];
  onPressCollateralSwitch?: (ticker: string) => void;
  onRowAction?: TableProps['onRowAction'];
  disabledKeys?: TableProps['disabledKeys'];
};

const LoanPositionsTable = ({
  variant = 'lend',
  title,
  assets,
  positions,
  onRowAction,
  disabledKeys,
  onPressCollateralSwitch
}: LoanPositionsTableProps): JSX.Element | null => {
  const { t } = useTranslation();
  const prices = useGetPrices();

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
      positions.map(({ currency, amount: amountProp, ...position }) => {
        const asset = <AssetCell ticker={currency.ticker} />;

        const { borrowApy, borrowReward, lendApy, lendReward } = assets[currency.ticker];

        const apyCellProps = isLending
          ? { apy: lendApy, rewards: lendReward }
          : {
              apy: borrowApy,
              rewards: borrowReward,
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
            isSelected={(position as LendPosition).isCollateral}
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
    [assets, isLending, onPressCollateralSwitch, onRowAction, positions, prices, showCollateral]
  );

  // TODO: cannot stay like this
  const placeholderTitle = `No ${variant} positions`;
  const placeholderDescription = `Your ${variant} positions will show here`;

  const placeholder = (
    <Card flex='1' justifyContent='center' alignItems='center'>
      <Flex direction='column' gap='spacing2' alignItems='center'>
        <Strong>{placeholderTitle}</Strong>
        <P>{placeholderDescription}</P>
      </Flex>
    </Card>
  );

  return (
    <Table
      title={title || (isLending ? t('loans.my_lend_positions') : t('loans.my_borrow_positions'))}
      onRowAction={onRowAction}
      rows={rows}
      columns={columns}
      disabledKeys={disabledKeys}
      placeholder={placeholder}
    />
  );
};

export { LoanPositionsTable };
export type { LoanPositionsTableProps };
